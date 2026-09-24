"""Regression test: the production-audio Modal volume must actually be
mounted where the renderer reads assets from.

scripts/sync-modal-production-audio.py uploads approved music/SFX into the
"underworld-production-audio" volume, but modal/app.py previously only
mounted "underworld-episode-output" on assemble_episode/generate_episode_audio,
and defaulted asset_root to "/root/assets/audio" (a path inside the
container image, never anything mounted) when the episode config didn't
set assetRoot. The synchronized volume could never actually be read during
mixing. This test fails if that wiring regresses.

Run with:
    python3 -m unittest discover -s modal/tests -v
"""
from __future__ import annotations

import importlib.util
import unittest
import warnings
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]


def _load_app_module():
    spec = importlib.util.spec_from_file_location("underworld_modal_app", REPO_ROOT / "modal" / "app.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class ProductionAudioVolumeMountTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.mod = _load_app_module()

    def test_production_audio_volume_name_matches_sync_script(self):
        sync_spec = importlib.util.spec_from_file_location(
            "sync_modal_production_audio", REPO_ROOT / "scripts" / "sync-modal-production-audio.py"
        )
        sync_mod = importlib.util.module_from_spec(sync_spec)
        sync_spec.loader.exec_module(sync_mod)

        # modal.Volume doesn't expose its name as a plain public attribute
        # across versions; compare via repr, which modal renders as
        # "modal.Volume.from_name('<name>')".
        self.assertIn("underworld-production-audio", repr(self.mod.production_audio_volume))
        self.assertIn("underworld-production-audio", repr(sync_mod.volume))
        self.assertEqual(self.mod.PRODUCTION_AUDIO_MOUNT, sync_mod.MOUNT)

    def test_assemble_episode_mounts_production_audio_volume(self):
        with warnings.catch_warnings():
            # Function.spec is deprecated (removal targeted for modal 1.6.0)
            # but is currently the most direct way to introspect a
            # decorated function's declared volumes; if this starts
            # failing after a modal upgrade, replace with whatever
            # non-deprecated introspection modal provides by then — the
            # invariant being tested (the mount exists) still matters.
            warnings.simplefilter("ignore")
            spec = self.mod.assemble_episode.spec
        self.assertIn(self.mod.PRODUCTION_AUDIO_MOUNT, spec.volumes)

    def test_generate_episode_audio_mounts_production_audio_volume(self):
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            spec = self.mod.generate_episode_audio.spec
        self.assertIn(self.mod.PRODUCTION_AUDIO_MOUNT, spec.volumes)

    def test_default_asset_root_is_the_mounted_volume_not_an_image_path(self):
        import ast

        tree = ast.parse((REPO_ROOT / "modal" / "app.py").read_text())
        found = []

        class Visitor(ast.NodeVisitor):
            def visit_Call(self, node):
                if (
                    isinstance(node.func, ast.Attribute)
                    and node.func.attr == "get"
                    and node.args
                    and isinstance(node.args[0], ast.Constant)
                    and node.args[0].value == "assetRoot"
                ):
                    found.append(node)
                self.generic_visit(node)

        Visitor().visit(tree)
        self.assertEqual(len(found), 1, "expected exactly one config.get('assetRoot', ...) call")
        default_arg = found[0].args[1]
        self.assertIsInstance(default_arg, ast.Name)
        self.assertEqual(default_arg.id, "PRODUCTION_AUDIO_MOUNT")


if __name__ == "__main__":
    unittest.main()
