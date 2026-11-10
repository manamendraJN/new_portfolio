import type { Publication } from "@/lib/types";

/**
 * Source: portfolio-details.md section 7.
 * Rules: separate my contribution from the group work; no accuracy figures or
 * results; never describe me as the conference presenter.
 */
export const research: Publication = {
  published: true,
  title: "Temporal Personal Fashion AI System with Multi-Component Integration",
  venue:
    "2026 IEEE International Research Conference on Smart Computing and Systems Engineering (SCSE 2026)",
  conferenceDate: "26 March 2026",
  venueLocation: "University of Kelaniya",
  doi: "10.1109/SCSE70081.2026.11499770",
  url: "https://doi.org/10.1109/SCSE70081.2026.11499770",
  isbn: "979-8-3315-4791-2",
  ieeeXplore: "11499770",
  projectId: "25-26J-339",
  supervisor: "Mr. S M B Harshanath, SLIIT",
  contribution: {
    title: "Dual-View Anthropometric Measurement System and Garment Size Recommendation",
    summary:
      "The module extracts body measurements from front and side photographs using an EfficientNet-B3 backbone. A custom scoring algorithm evaluates compatibility with available garment sizes and produces confidence-rated recommendations with personalized fit advice.",
  },
  groupWork: [
    "Temporal Wardrobe Intelligence",
    "Personalized Accessories Recommendation",
    "Integrated Grooming Recommendation",
  ],
  // Original illustrations, to be drawn in Phase 5. Always labelled as illustrations.
  illustrations: [
    {
      src: "",
      kind: "illustration",
      alt: "Illustration of front and side body measurements",
      caption: "Front and side body measurements",
      drawing: "measurements",
    },
    {
      src: "",
      kind: "illustration",
      alt: "Illustration of feature extraction from the two views",
      caption: "Feature extraction",
      drawing: "extraction",
    },
    {
      src: "",
      kind: "illustration",
      alt: "Illustration of garment-size recommendation",
      caption: "Garment-size recommendation",
      drawing: "recommendation",
    },
  ],
};
