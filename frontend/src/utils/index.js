import { surpriseMePrompts } from "../constants";
import FileSaver from "file-saver";

export function getRandomPrompts(prompt) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomprompt = surpriseMePrompts[randomIndex];

  if (randomprompt === "prompt") return getRandomPrompts(prompt);
  return randomprompt;
}

/*export async function downloadImage(_id, photo) {
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
}
*/

export const downloadImage = async (_id, photo) => {
  try {
    const response = await fetch(photo);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `download-${_id}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};
