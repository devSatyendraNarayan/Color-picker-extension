const colorPickerBtn = document.querySelector("#color-picker");
const colorList = document.querySelector(".all-colors");
const clearAll = document.querySelector(".clear-all");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

//Copying the color code to the clipboard and updating the element text
const copyColor = (elem) => {
  const color = elem.innerText.trim(); // Get the text content of the clicked element
  navigator.clipboard.writeText(color); // Copy the color value to the clipboard
  elem.innerText = "Copied"; // Change the text of the clicked element to "Copied"
  setTimeout(() => (elem.innerText = color), 1000); // Revert the text back to the original color value after 1 second
};
const showColors = () => {
  if (!pickedColors.length) return; //Returning if there are no picked
  colorList.innerHTML = pickedColors
    .map(
      (color) => `
                <li class="color">
                    <span class="rect" style="background-color: ${color}; border: 1px solid ${
        color == "#ffffff" ? "#ccc" : color
      }"></span>
                    <span class="value" data-color="${color}">${color}</span>
                </li>
    `
    )
    .join(""); //Generating li for the picked color and adding it to the colorList
  document.querySelector(".picked-colors").classList.remove("hide");
  //Add a click event listener to each color element to copy the color code
  document.querySelectorAll(".color").forEach((li) => {
    li.addEventListener("click", (e) => copyColor(e.currentTarget));
  });
};
showColors();
const activateEyeDropper = () => {
    document.body.style.display = "none";
    setTimeout(async () => {
        try {
            // Opening the eye dropper and getting the selected color
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            
            // Copy the color code to the clipboard
            await navigator.clipboard.writeText(sRGBHex);

            // Adding the color to the list if it doesn't already exist
            if (!pickedColors.includes(sRGBHex)) {
                pickedColors.push(sRGBHex);
                localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
                showColors();
            }
        } catch (error) {
            console.error("Failed to copy the color code:", error);
        } finally {
            document.body.style.display = "block";
        }
    }, 10);
};

//Clearing all picked colors, updating local-storage and hiding the pickedColors element
const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
  document.querySelector(".picked-colors").classList.add("hide");
  location.reload();
};
clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);
