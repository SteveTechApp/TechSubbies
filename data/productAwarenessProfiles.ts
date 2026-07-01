import type { ProductAwarenessProfile } from "../types/skillProfiles";

export const productAwarenessProfiles: ProductAwarenessProfile[] = [
  {
    id: "av-signal-management-awareness",
    title: "AV Signal Management Awareness",
    category: "signal-management",
    summary:
      "Skills-based awareness of AV distribution, switching, extenders, matrices and signal routing technologies.",
    awarenessAreas: [
      {
        title: "Must-have",
        mustHave: [
          "Can explain the difference between a source, switcher, matrix, extender, receiver and display",
          "Understands basic HDMI signal flow",
          "Understands why distance, resolution and cable quality matter",
          "Can recognise common signal problems such as no image, intermittent image or wrong resolution"
        ],
        niceToHave: [
          "Awareness of EDID and HDCP",
          "Awareness of HDBaseT",
          "Awareness of AVoIP",
          "Awareness of scaler or multiviewer use cases",
          "Exposure to brands such as WyreStorm, Extron, Kramer, Lightware, Blustream, Atlona, CYP or AVPro Edge"
        ]
      }
    ]
  },
  {
    id: "uc-conferencing-awareness",
    title: "UC / Conferencing Product Awareness",
    category: "uc-conferencing",
    summary:
      "Skills-based awareness of meeting-room, BYOD, BYOM, camera, microphone and conferencing workflows.",
    awarenessAreas: [
      {
        title: "Must-have",
        mustHave: [
          "Understands the role of cameras, microphones, speakers and USB connectivity in a meeting room",
          "Can identify common BYOD/BYOM connection paths",
          "Can support basic Teams, Zoom or Webex call testing",
          "Can recognise common audio or camera issues"
        ],
        niceToHave: [
          "Exposure to Logitech, Yealink, Poly, Jabra, Huddly, Shure, Sennheiser or Biamp",
          "Awareness of USB extenders and USB switching",
          "Awareness of room bars, PTZ cameras and ceiling microphones",
          "Awareness of camera presets and microphone pickup zones"
        ]
      }
    ]
  },
  {
    id: "audio-platform-awareness",
    title: "Audio Platform Awareness",
    category: "audio",
    summary:
      "Skills-based awareness of DSP, microphones, installed speakers, acoustic issues and conferencing audio.",
    awarenessAreas: [
      {
        title: "Must-have",
        mustHave: [
          "Understands microphone, DSP, amplifier and speaker signal flow",
          "Understands gain, mute and feedback at a basic level",
          "Can recognise poor audio pickup, echo, distortion or low level",
          "Can support basic audio validation during handover"
        ],
        niceToHave: [
          "Exposure to Q-SYS, Biamp, Shure, Sennheiser, Yamaha, Allen & Heath, BSS or Symetrix",
          "Awareness of AEC",
          "Awareness of room acoustics and reverberation",
          "Awareness of sound mapping and loudspeaker coverage"
        ]
      }
    ]
  },
  {
    id: "control-platform-awareness",
    title: "Control Platform Awareness",
    category: "control",
    summary:
      "Skills-based awareness of AV control systems, touch panels, room modes, device control and automation behaviour.",
    awarenessAreas: [
      {
        title: "Must-have",
        mustHave: [
          "Understands that control systems send commands to AV devices",
          "Can test common user controls such as source, volume, display power and room mode",
          "Can record control faults clearly",
          "Can follow a control test script"
        ],
        niceToHave: [
          "Exposure to Crestron, Extron, Q-SYS, AMX, Kramer, Lightware or Atlona control",
          "Awareness of RS-232, IR, relay, TCP/IP and API control",
          "Awareness of touch panel UI design",
          "Awareness of room automation and scheduling"
        ]
      }
    ]
  },
  {
    id: "video-wall-led-awareness",
    title: "Video Wall / LED Product Awareness",
    category: "video-wall-led",
    summary:
      "Skills-based awareness of video walls, LED systems, processors, scaling, canvas mapping and display layouts.",
    awarenessAreas: [
      {
        title: "Must-have",
        mustHave: [
          "Understands the difference between single display, LCD video wall and LED wall",
          "Can identify sources, processors and displays in a video wall signal path",
          "Understands layout basics such as 2x2, 3x3, canvas and source window",
          "Can help validate that the correct content appears on the correct display area"
        ],
        niceToHave: [
          "Exposure to Novastar, Brompton, Colorlight or other LED processors",
          "Awareness of pixel pitch and viewing distance",
          "Awareness of scaler and processor configuration",
          "Awareness of multiview layouts and bezel compensation"
        ]
      }
    ]
  },
  {
    id: "network-av-awareness",
    title: "Networked AV / AVoIP Awareness",
    category: "network-av",
    summary:
      "Skills-based awareness of networked AV concepts without turning this into a network engineering profile.",
    awarenessAreas: [
      {
        title: "Must-have",
        mustHave: [
          "Understands that some AV systems use network switches to move video, audio or control",
          "Can identify encoder, decoder and network switch roles",
          "Can follow patching instructions for networked AV devices",
          "Can record link, power and status LED information clearly"
        ],
        niceToHave: [
          "Awareness of VLANs, multicast and IP addressing",
          "Exposure to AVoIP brands such as WyreStorm NetworkHD, ZeeVee, Just Add Power, AMX SVSI, Crestron NVX or SDVoE systems",
          "Awareness of 1GbE versus 10GbE systems",
          "Awareness of controller/gateway devices"
        ]
      }
    ]
  }
];
