"""Deterministic podcast post-production mixer.

Mixes narration, music beds, stingers, transitions and SFX from a production
plan. No generative model runs here. Every non-voice asset must exist in the
asset registry with provenance/license metadata before a release render.
"""
from __future__ import annotations
from pathlib import Path
from pydub import AudioSegment

def _asset(path: str, root: str | None) -> AudioSegment:
    p=Path(root or ".")/path
    if not p.exists(): raise FileNotFoundError(f"Production asset not found: {p}")
    return AudioSegment.from_file(p)

def _fade(clip: AudioSegment, cue: dict) -> AudioSegment:
    if cue.get("fadeInMs"): clip=clip.fade_in(int(cue["fadeInMs"]))
    if cue.get("fadeOutMs"): clip=clip.fade_out(int(cue["fadeOutMs"]))
    return clip

def _loop_to(clip: AudioSegment, duration_ms: int) -> AudioSegment:
    if len(clip)>=duration_ms: return clip[:duration_ms]
    out=AudioSegment.empty()
    while len(out)<duration_ms: out += clip
    return out[:duration_ms]

def mix_production(narration: AudioSegment, plan: dict, asset_root: str | None=None) -> tuple[AudioSegment,list[dict]]:
    """Overlay configured assets and return (mix, applied-cue manifest)."""
    mix=narration
    applied=[]
    for cue in plan.get("cues",[]):
        kind=cue["type"]; start=int(cue.get("startMs",0))
        clip=_asset(cue["asset"],asset_root)
        if cue.get("durationMs"): clip=_loop_to(clip,int(cue["durationMs"]))
        clip=_fade(clip,cue) + float(cue.get("gainDb",0))
        # Duck narration beneath beds; stingers/SFX normally overlay without ducking.
        if kind in {"music-bed","intro-bed","outro-bed"} and cue.get("duckNarrationDb"):
            end=min(len(mix),start+len(clip))
            if end>start:
                before=mix[:start]; under=mix[start:end]+float(cue["duckNarrationDb"]); after=mix[end:]
                mix=before+under+after
        mix=mix.overlay(clip,position=start)
        applied.append({"id":cue["id"],"type":kind,"asset":cue["asset"],"startMs":start,"durationMs":len(clip),"gainDb":cue.get("gainDb",0),"duckNarrationDb":cue.get("duckNarrationDb")})
    return mix,applied


def resolve_markers(plan: dict, segment_boundaries: dict[str, tuple[int, int]]) -> dict:
    """Resolve semantic `segment-id:start|end` markers to absolute milliseconds.

    `segment_boundaries` must be the *actual* (start_ms, end_ms) of each
    segment in the assembled dialogue track — i.e. positions read back from
    the real mixed AudioSegment as it was built (see
    `assemble_episode`'s dialogue-assembly loop), not durations summed
    independently of it. Recomputing boundaries from raw segment durations
    here previously ignored the crossfade overlap `AudioSegment.append`
    applies between segments and the conditional per-segment pause
    (`pauseAfterSegment`), which silently drifted cue timing away from the
    real edit by seconds over a long episode.
    """
    starts=segment_boundaries
    resolved={**plan,"cues":[]}
    for raw in plan.get("cues",[]):
        cue=dict(raw)
        for field,out in (("startMarker","startMs"),("endMarker","endMs")):
            marker=cue.pop(field,None)
            if marker:
                sid,edge=marker.rsplit(":",1)
                if sid not in starts: raise KeyError(f"Unknown production marker: {marker}")
                cue[out]=starts[sid][0 if edge=="start" else 1]
        if "endMs" in cue and "durationMs" not in cue:
            cue["durationMs"]=max(0,int(cue["endMs"])-int(cue.get("startMs",0)))
        resolved["cues"].append(cue)
    return resolved

def validate_asset_clearance(plan: dict, registry: dict) -> None:
    """Fail closed when a referenced production asset is absent or uncleared."""
    by_path={a["path"]:a for a in registry.get("assets",[])}
    failures=[]
    for cue in plan.get("cues",[]):
        rec=by_path.get(cue["asset"])
        if not rec: failures.append(f"{cue['asset']}: missing from registry"); continue
        if rec.get("status")!="approved": failures.append(f"{cue['asset']}: status={rec.get('status')}")
        lic=rec.get("license")
        if not lic: failures.append(f"{cue['asset']}: missing license/ownership record")
    if failures:
        raise PermissionError("Production asset clearance failed: "+"; ".join(failures))
