import unittest
from audio.postproduction import resolve_markers, validate_asset_clearance

class PostProductionTests(unittest.TestCase):
    def test_resolves_semantic_markers(self):
        plan={"cues":[{"id":"x","type":"music-bed","asset":"a.wav","startMarker":"a:start","endMarker":"b:end"}]}
        out=resolve_markers(plan,["a","b"],[1000,2000])
        self.assertEqual(out["cues"][0]["startMs"],0)
        self.assertEqual(out["cues"][0]["durationMs"],3000)

    def test_clearance_fails_closed(self):
        plan={"cues":[{"id":"x","asset":"a.wav"}]}
        with self.assertRaises(PermissionError):
            validate_asset_clearance(plan,{"assets":[{"path":"a.wav","status":"required-not-procured","license":None}]})

    def test_clearance_accepts_approved_owned_asset(self):
        plan={"cues":[{"id":"x","asset":"a.wav"}]}
        validate_asset_clearance(plan,{"assets":[{"path":"a.wav","status":"approved","license":{"type":"owned"}}]})

if __name__=="__main__":
    unittest.main()

