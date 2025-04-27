const summarizeBtn = document.getElementById("summarizeBtn");
const textArea = document.getElementById("inputText");
let isLoading = false;

summarizeBtn.addEventListener("click", async () => {
  const enteredText = textArea.value.trim();

  if (enteredText !== "") {
    try {
      isLoading = true;
      const API_KEY = import.meta.env.VITE_API_KEY;

      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: enteredText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch summarization");
      }

      const data = await response.json();
      const summarizedTextContainer = document.getElementById("summarizedText");

      // Use .value for textarea
      summarizedTextContainer.value =
        data[0]?.summary_text || "No summary generated.";
    } catch (error) {
      console.error(error);
      showErrorModal(
        "Something went wrong while summarizing. Please try again."
      );
    } finally {
      isLoading = false;
    }
  } else {
    showErrorModal("Please enter your text before summarizing!");
  }
});

// Function to show the error modal
function showErrorModal(message) {
  const errorMessageContainer = document.querySelector(".modal-description");
  errorMessageContainer.textContent = message;

  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}
