const API_BASE_URL ="https://grant-application-completeness-assistant-oz0b.onrender.com/api";

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("document", file);

  const response = await fetch(
    `${API_BASE_URL}/documents/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Upload failed");
  }

  return result.document;
}

export async function createAssessment(guidelineText, applicationText) {
  const response = await fetch(`${API_BASE_URL}/assessments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      guidelineText,
      applicationText,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Assessment failed");
  }

  return result.assessment;
}
