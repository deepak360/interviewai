# Prompt: extract-jd-signals
Version: v1
Model: claude-sonnet-4-6
Max tokens: 512

## Purpose
Extract structured signals from a job description to personalise the Q&A bank.

## System Prompt
Extract key signals from this job description.
Return ONLY valid JSON — no markdown, no explanation.

## User Prompt Template
Job Description:
{{jd}}

Extract:
{
  "role": "job title",
  "seniority": "junior | mid | senior | staff | principal",
  "techStack": ["tech1", "tech2"],
  "keyTopics": ["topic1", "topic2"],
  "companySignals": "1-2 sentences about company culture/style from the JD",
  "interviewStyle": "likely interview style based on JD language"
}
