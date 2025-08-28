# gesture-vision-plugin-presenter

Controls presentation software (e.g., PowerPoint, Google Slides) using keyboard shortcuts.

---

<p align="center">
  <img src="https://raw.githubusercontent.com/jim1982ha/gesture-vision/main/packages/frontend/public/icons/icon-72.webp" width="80" alt="Presenter Plugin Icon">
</p>
<h1 align="center">GestureVision - Presenter Plugin</h1>
<p align="center">
  <strong>Navigate your presentations hands-free. This plugin simplifies controlling slideshows with intuitive gestures.</strong>
</p>

---

The Presenter plugin is a specialized version of the OS Command plugin, tailored specifically for controlling presentation software like Microsoft PowerPoint, Google Slides, Keynote, and others. It maps common presentation actions to the underlying keyboard shortcuts.

**Important:** This plugin requires the separate [GestureVision Companion App](https://github.com/your-repo/gesture-vision-companion) to be running on the computer that is displaying the presentation.

## ✨ Key Features

-   **Simplified Interface:** Instead of memorizing keyboard shortcuts, select from a simple dropdown of common presentation actions.
-   **Universal Commands:** Works with most presentation software by sending standard keyboard commands (`ArrowRight`, `ArrowLeft`, `F5`, `Escape`).
-   **Network Capable:** Control a presentation running on a different laptop by specifying its IP address.

## 🔧 Configuration

This plugin has no global configuration. All settings are configured per action.

### Action Configuration

When you select "Presenter" as the Action Type for a gesture, you will see the following fields:

-   **Action:** A dropdown menu with the following choices:
    -   Next Slide
    -   Previous Slide
    -   Start Presentation
    -   End Presentation
    -   Blank/Unblank Screen
-   **Companion Host (Optional):** The IP address or hostname of the machine running the companion app and displaying the presentation. Defaults to `localhost`.

## 🚀 Usage Example

**Goal:** Use "Thumb Up" to go to the next slide and "Thumb Down" for the previous slide during a presentation.

1.  Ensure the **GestureVision Companion App** is running on your presentation laptop.
2.  In the GestureVision web UI, configure the first action:
    -   **Gesture:** "Thumb Up"
    -   **Action Type:** "Presenter"
    -   **Action:** `Next Slide`
    -   Click **Add Configuration**.
3.  Configure the second action:
    -   **Gesture:** "Thumb Down"
    -   **Action Type:** "Presenter"
    -   **Action:** `Previous Slide`
    -   Click **Add Configuration**.

You can now navigate your slideshow completely hands-free.

---

Part of the **GestureVision** application.