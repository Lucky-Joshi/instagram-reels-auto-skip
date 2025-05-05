# Instagram Reels Auto-Skip Chrome Extension

## 📜 Description

**Instagram Reels Auto-Skip** is a Chrome extension that automatically skips to the next Instagram Reel after a video has been replayed **twice**. It works on both:

- The dedicated [Instagram Reels feed](https://www.instagram.com/reels/)
- Reels embedded in user profiles

The extension detects when a reel has finished playing two times and simulates a right-arrow key press (`→`) to move to the next reel — mimicking a natural swipe.

---

## ⚙️ Features

- ✅ Detects video elements dynamically as Instagram loads content via React.
- 🔁 Tracks how many times a video has ended.
- 👉 Auto-skips to the next reel after **2 full replays**.
- 🔄 Resets the counter if the user manually changes to another reel.
- 🧠 Smart behavior on both `/reels/` and `/reel/` pages.

---

## 🚀 Installation Steps

1. **Clone or Download** this repository and save it to a folder.
2. Open **Google Chrome** and go to `chrome://extensions/`.
3. Enable **Developer mode** (top-right corner).
4. Click **"Load unpacked"** and select the folder where you saved the files.
5. Go to [Instagram Reels](https://www.instagram.com/reels/) and test it out!

---

## 🛠️ How It Works

- Uses a **MutationObserver** to detect when a new `<video>` (Reel) is rendered.
- Listens for the `ended` event on the video element.
- After the video finishes playing **twice**, it dispatches a synthetic `ArrowRight` key event.
- This simulates the user's swipe to the next reel.
- If the user navigates manually (via scroll/swipe/click), the replay counter is reset for the new reel.

---

## 🧾 Permissions

- `https://www.instagram.com/*`: Required to run the script on Instagram Reels and profile pages.

---

## 📌 Notes

- This extension works best in the desktop browser version of Instagram.
- It mimics real user behavior and does not rely on private APIs or automation frameworks.
- This project is for **educational and personal productivity purposes**.

---

## 📄 License

This project is open-source and free to use under the [MIT License](https://opensource.org/licenses/MIT).

---

## 🙋‍♂️ Author

Developed by **Lucky Joshi**  
For feedback or ideas, feel free to reach out!

