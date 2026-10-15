
function findEvidence(text, keywords) {
  if (typeof text !== "string" || !text.trim()) {
    return null;
  }

  const lowerText = text.toLowerCase();

  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword.toLowerCase());

    if (index === -1) continue;

    // Find the line containing the matched keyword.
    let start = text.lastIndexOf("\n", index);
    start = start === -1 ? 0 : start + 1;

    let end = text.indexOf("\n", index);
    end = end === -1 ? text.length : end;

    let quote = text.slice(start, end).trim();

    // If PDF extraction produced one very long line,
    // return a shorter excerpt around the keyword.
    if (quote.length > 700) {
      const keywordPosition = index - start;
      const excerptStart = Math.max(0, keywordPosition - 250);

      quote = quote.slice(
        excerptStart,
        excerptStart + 700
      );
    }

    if (quote) {
      return {
        quote,
        matchedKeyword: keyword,
      };
    }
  }

  return null;
}

// DEVELOPMENT ONLY:
// Rule-based matching, not AI analysis or verified compliance.
export function createMockAssessment(
  guidelineText,
  applicationText
) {
  const requirements = [
    {
      id: "project-description",
      title: "Project description",
      keywords: [
        "project description",
        "project overview",
        "proposed project",
        "community need",
        "training activities",
      ],
    },
    {
      id: "organisational-profile",
      title: "Organisational profile and registration",
      keywords: [
        "organisational profile",
        "organization profile",
        "proof of registration",
        "registration status",
        "registration number",
      ],
    },
    {
      id: "budget",
      title: "Itemised project budget",
      keywords: [
        "itemised project budget",
        "itemized project budget",
        "total amount requested",
        "project budget",
        "total requested amount",
      ],
    },
    {
      id: "project-timeline",
      title: "Six-month implementation timeline",
      keywords: [
        "implementation timeline",
        "six-month implementation timeline",
        "project timeline",
        "month 1:",
        "project duration",
      ],
    },
    {
      id: "project-team",
      title: "Project team and responsibilities",
      keywords: [
        "project team",
        "names and responsibilities",
        "project lead",
        "lead trainer",
      ],
    },
    {
      id: "monitoring-outcomes",
      title: "Monitoring plan and measurable outcomes",
      keywords: [
        "measurable outcomes",
        "monitoring plan",
        "expected outcomes",
        "project outcomes",
        "outcome 1:",
      ],
    },
    {
      id: "supporting-documents",
      title: "Required supporting documents",
      keywords: [
        "supporting documents",
        "required supporting documents",
        "brief cvs",
        "proof of organisational registration",
      ],
    },
  ];

  const results = requirements.map((requirement) => {
    const guidelineEvidence = findEvidence(
      guidelineText,
      [requirement.title, ...requirement.keywords]
    );

    const applicationEvidence = findEvidence(
      applicationText,
      requirement.keywords
    );

    // A keyword match is only a suggestion.
    // It does not prove that the requirement is satisfied.
    const status = applicationEvidence
      ? "needs-review"
      : "not-found";

    return {
      id: requirement.id,
      requirement: requirement.title,
      importance: "unverified",
      status,
      guidelineEvidence,
      applicationEvidence,
      clarificationQuestion: applicationEvidence
        ? `Please verify whether the evidence fully addresses: ${requirement.title}.`
        : `Where does your application address ${requirement.title.toLowerCase()}?`,
      reviewDecision: "pending",
    };
  });

  return {
    assessmentMode: "development-mock",
    notice:
      "Development mock only. These are rule-based keyword matches, not AI analysis or verified compliance. A reviewer must verify each result.",
    createdAt: new Date().toISOString(),
    guidelineCharacterCount: guidelineText.length,
    applicationCharacterCount: applicationText.length,
    requirements: results,
    summary: {
      total: results.length,
      needsReview: results.filter(
        (item) => item.status === "needs-review"
      ).length,
      notFound: results.filter(
        (item) => item.status === "not-found"
      ).length,
      completed: 0,
    },
  };
}
