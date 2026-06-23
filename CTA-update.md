# CTA Update

## Studio Configuration

- Add an option in Studio for creators to enable a CTA button on video-based viewer experiences.
- When enabled, Studio should let the creator provide the CTA destination URL.
- If no custom CTA label is added in the first version, the viewer can use a default label such as `Learn More`.

## Viewer Behavior

- The CTA button should appear as an overlay on the viewer's video only after the video has finished the configured playback requirement.
- The playback requirement comes from Studio:
  - once, when the video is configured to play one time;
  - after the configured number of plays, when Studio sets a specific repeat count.
- Showing the CTA must not stop, pause, or override the video's configured looping behavior.
- If Studio says the video should continue looping, the video should continue looping after the CTA appears.
- The CTA overlay is only a viewer action layer. It does not become a playback controller.

## Click Behavior

- Clicking the CTA button should open the Studio-prescribed URL.
- The URL should be validated or normalized by Studio before publishing so the viewer receives a usable link.
