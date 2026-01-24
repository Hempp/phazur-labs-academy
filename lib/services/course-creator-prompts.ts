// Course Creator Prompts - Expert Educational Framework
// 30+ years of curriculum design expertise encoded in prompts

export const EDUCATION_GURU_SYSTEM = `You are an expert curriculum designer and instructional architect with 30+ years of experience creating transformative learning experiences. You combine:

- **Bloom's Taxonomy**: Structure learning from Remember → Understand → Apply → Analyze → Evaluate → Create
- **ADDIE Model**: Analysis, Design, Development, Implementation, Evaluation
- **Backward Design**: Start with desired outcomes, then design assessments, then instruction
- **Cognitive Load Theory**: Chunk information, reduce extraneous load, optimize germane load
- **Spaced Repetition**: Build in review and reinforcement
- **Active Learning**: Prioritize engagement over passive consumption

Your courses are known for:
1. Crystal-clear learning objectives tied to measurable outcomes
2. Logical progression that builds on prior knowledge
3. Engaging content that maintains attention
4. Varied assessments that truly measure understanding
5. Practical applications that cement learning

Always design with the learner's journey in mind. Every element should serve the learning objective.`

export const GENERATE_OUTLINE_PROMPT = `Create a comprehensive course outline for the following topic.

TOPIC: {topic}
TARGET AUDIENCE: {audience}
SKILL LEVEL: {level}
ESTIMATED DURATION: {duration}

Design a course structure following these principles:

1. **Module Organization**: Group related concepts into 3-7 modules
2. **Lesson Flow**: Each module should have 3-6 lessons that build progressively
3. **Learning Objectives**: Each lesson needs clear, measurable objectives using action verbs
4. **Content Mix**: Balance theory (30%), demonstration (30%), and practice (40%)
5. **Assessment Points**: Include formative assessments after each module

For each lesson, specify:
- Title (engaging and descriptive)
- Duration in minutes
- Learning objectives (2-4 per lesson)
- Content type (video, reading, interactive, quiz, assignment)
- Brief description of what will be covered

Respond with a JSON object in this exact structure:
{
  "courseTitle": "string",
  "courseDescription": "string (2-3 sentences)",
  "targetAudience": "string",
  "prerequisites": ["string"],
  "learningOutcomes": ["string (4-6 course-level outcomes)"],
  "estimatedDuration": "string",
  "modules": [
    {
      "title": "string",
      "description": "string",
      "orderIndex": number,
      "lessons": [
        {
          "title": "string",
          "description": "string",
          "durationMinutes": number,
          "contentType": "video" | "article" | "quiz" | "assignment",
          "learningObjectives": ["string"],
          "orderIndex": number
        }
      ]
    }
  ]
}`

export const GENERATE_LESSON_SCRIPT_PROMPT = `Create an engaging video lesson script for the following lesson.

COURSE: {courseName}
MODULE: {moduleName}
LESSON: {lessonTitle}
DURATION: {duration} minutes
LEARNING OBJECTIVES:
{objectives}

PREVIOUS LESSONS CONTEXT:
{previousContext}

Create a script that:

1. **Hook (10%)**: Start with an attention-grabbing opening - a question, surprising fact, or relatable scenario
2. **Overview (5%)**: Brief roadmap of what learners will achieve
3. **Content (65%)**: Present information in digestible chunks with:
   - Clear explanations using analogies and real-world examples
   - Visual cues for graphics/animations [VISUAL: description]
   - Pause points for reflection [PAUSE]
   - Transitions between concepts
4. **Summary (10%)**: Recap key points with emphasis on practical application
5. **Call to Action (10%)**: Preview next lesson, encourage practice

Writing guidelines:
- Use conversational, second-person voice ("you" not "students")
- Sentences under 20 words for spoken delivery
- Include presenter directions in [brackets]
- Mark emphasis with **bold**
- Aim for 120-150 words per minute of video

Respond with a JSON object:
{
  "lessonTitle": "string",
  "hook": "string (opening 30-60 seconds)",
  "overview": "string (brief roadmap)",
  "sections": [
    {
      "title": "string",
      "content": "string (script text with [VISUAL] and [PAUSE] markers)",
      "durationSeconds": number,
      "visualNotes": "string (description for graphics/animations)"
    }
  ],
  "summary": "string",
  "callToAction": "string",
  "totalDurationMinutes": number,
  "keyTerms": ["string"],
  "practicePrompt": "string (brief exercise for learners)"
}`

export const GENERATE_QUIZ_PROMPT = `Create an assessment quiz for the following lesson/module.

COURSE: {courseName}
MODULE: {moduleName}
LESSON: {lessonTitle}
LEARNING OBJECTIVES:
{objectives}

KEY CONCEPTS COVERED:
{keyConcepts}

Create a quiz that:

1. **Tests Comprehension**: Not just recall, but understanding
2. **Varies Question Types**: Mix formats to assess different skills
3. **Provides Learning**: Wrong answers should teach, not just fail
4. **Builds Confidence**: Start easier, progress to challenging

Question type guidelines:
- **Single Choice**: Best for factual knowledge, clear right answer
- **Multiple Choice**: When multiple aspects apply
- **True/False**: For common misconceptions
- **Fill in Blank**: For terminology and key concepts
- **Short Answer**: For application and synthesis

Create {questionCount} questions with this distribution:
- 40% Knowledge/Recall (Bloom's levels 1-2)
- 40% Application/Analysis (Bloom's levels 3-4)
- 20% Evaluation/Synthesis (Bloom's levels 5-6)

Respond with a JSON object:
{
  "quizTitle": "string",
  "description": "string",
  "passingScore": number (percentage, typically 70-80),
  "timeLimit": number (minutes, null for no limit),
  "questions": [
    {
      "questionText": "string",
      "questionType": "single_choice" | "multiple_choice" | "true_false" | "fill_blank" | "short_answer",
      "points": number,
      "bloomsLevel": 1-6,
      "options": [
        {
          "text": "string",
          "isCorrect": boolean,
          "feedback": "string (explanation why right/wrong)"
        }
      ],
      "correctAnswer": "string (for fill_blank/short_answer)",
      "explanation": "string (shown after answering)"
    }
  ]
}`

export const GENERATE_ASSIGNMENT_PROMPT = `Create a practical assignment for the following lesson/module.

COURSE: {courseName}
MODULE: {moduleName}
LESSON: {lessonTitle}
LEARNING OBJECTIVES:
{objectives}

SKILLS TO ASSESS:
{skills}

Create an assignment that:

1. **Applies Learning**: Requires using concepts from the lesson
2. **Is Authentic**: Resembles real-world tasks in the field
3. **Is Achievable**: Can be completed with lesson knowledge + reasonable effort
4. **Has Clear Criteria**: Learners know exactly what success looks like
5. **Encourages Creativity**: Allows for personal expression within guidelines

Assignment components:
- Clear instructions with step-by-step guidance
- Rubric with specific, measurable criteria
- Examples or templates if helpful
- Estimated time to complete
- Submission format requirements

Respond with a JSON object:
{
  "assignmentTitle": "string",
  "description": "string (overview and purpose)",
  "instructions": "string (detailed step-by-step, use markdown)",
  "submissionType": "file" | "url" | "text",
  "estimatedMinutes": number,
  "dueInDays": number (suggested),
  "points": number,
  "rubric": [
    {
      "criterion": "string (what is being assessed)",
      "weight": number (percentage of total),
      "levels": [
        {
          "label": "Excellent" | "Good" | "Satisfactory" | "Needs Improvement",
          "points": number,
          "description": "string (specific observable behaviors)"
        }
      ]
    }
  ],
  "resources": ["string (helpful links or materials)"],
  "tips": ["string (advice for success)"]
}`

export const ENHANCE_CONTENT_PROMPT = `Review and enhance the following educational content.

ORIGINAL CONTENT:
{content}

CONTEXT:
- Course: {courseName}
- Target Audience: {audience}
- Learning Objectives: {objectives}

Enhance this content by:

1. **Clarity**: Simplify complex sentences, define jargon
2. **Engagement**: Add questions, examples, analogies
3. **Structure**: Improve flow and transitions
4. **Accessibility**: Ensure inclusive language
5. **Retention**: Add memory hooks and summaries

Maintain the original intent and information while making it more effective for learning.

Respond with:
{
  "enhancedContent": "string",
  "changessMade": ["string (list of improvements)"],
  "suggestionsForVisuals": ["string"],
  "discussionQuestions": ["string"]
}`

// Utility function to fill prompt templates
export function fillPromptTemplate(
  template: string,
  variables: Record<string, string | number | string[]>
): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`
    const stringValue = Array.isArray(value) ? value.join('\n- ') : String(value)
    result = result.replace(new RegExp(placeholder, 'g'), stringValue)
  }
  return result
}
