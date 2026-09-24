import unittest
from audio.postproduction import resolve_markers, validate_asset_clearance

class PostProductionTests(unittest.TestCase):
    def test_resolves_semantic_markers(self):
        plan={"cues":[{"id":"x","type":"music-bed","asset":"a.wav","startMarker":"a:start","endMarker":"b:end"}]}
        out=resolve_markers(plan,{"a":(0,1000),"b":(1000,3000)})
        self.assertEqual(out["cues"][0]["startMs"],0)
        self.assertEqual(out["cues"][0]["durationMs"],3000)

    def test_resolves_markers_against_boundaries_with_crossfade_and_pause_gaps(self):
        # Regression: resolve_markers must use whatever boundaries it is
        # given, including ones that reflect a crossfade overlap (segment
        # boundaries closer together than the sum of raw durations) or an
        # inserted pause (segment boundaries farther apart) — it must not
        # independently re-derive positions from raw durations, which is
        # exactly the bug this replaces (see modal/app.py's
        # assemble_episode, which now records real boundaries from the
        # assembled AudioSegment instead of summing clip lengths).
        boundaries = {
            "intro": (0, 1000),
            # 150ms crossfade overlap: next segment starts before the raw
            # sum of durations would predict.
            "body": (850, 1850),
            # 800ms pause inserted after "body": next segment starts later
            # than the raw sum of durations would predict.
            "outro": (2650, 3650),
        }
        plan = {"cues": [
            {"id": "chapter-cue", "type": "stinger", "asset": "s.wav", "startMarker": "body:start"},
            {"id": "outro-bed", "type": "outro-bed", "asset": "o.wav", "startMarker": "outro:start", "endMarker": "outro:end"},
        ]}
        out = resolve_markers(plan, boundaries)
        self.assertEqual(out["cues"][0]["startMs"], 850)
        self.assertEqual(out["cues"][1]["startMs"], 2650)
        self.assertEqual(out["cues"][1]["durationMs"], 1000)

    def test_clearance_fails_closed(self):
        plan={"cues":[{"id":"x","asset":"a.wav"}]}
        with self.assertRaises(PermissionError):
            validate_asset_clearance(plan,{"assets":[{"path":"a.wav","status":"required-not-procured","license":None}]})

    def test_clearance_accepts_approved_owned_asset(self):
        plan={"cues":[{"id":"x","asset":"a.wav"}]}
        validate_asset_clearance(plan,{"assets":[{"path":"a.wav","status":"approved","license":{"type":"owned"}}]})

if __name__=="__main__":
    unittest.main()

