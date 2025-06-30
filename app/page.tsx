"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Lock, Smartphone, Wifi } from "lucide-react"

const questions = [
  {
    id: "q1",
    category: "Password Management",
    question: "How do you manage your passwords across platforms?",
    options: [
      { value: "4", label: "Use a password manager with unique passwords for each account" },
      { value: "2", label: "Maintain a notebook with all passwords written down" },
      { value: "2", label: "Use the same password with slight variations" },
      { value: "1", label: "Memorize one common password and reuse it" },
    ],
  },
  {
    id: "q2",
    category: "Password Management",
    question: "How often do you change your passwords?",
    options: [
      { value: "4", label: "Every 3–6 months" },
      { value: "3", label: "Only when prompted or forced" },
      { value: "2", label: "Rarely or never" },
      { value: "3", label: "I only change them if there's a security issue" },
    ],
  },
  {
    id: "q3",
    category: "Password Management",
    question: "What is the length of your typical password?",
    options: [
      { value: "4", label: "12+ characters with special symbols and numbers" },
      { value: "3", label: "8–11 characters with some variety" },
      { value: "2", label: "6–7 characters, mostly alphabets" },
      { value: "1", label: "4–5 characters, usually easy to remember" },
    ],
  },
  {
    id: "q4",
    category: "Password Management",
    question: "Which of the following best describes your password complexity?",
    options: [
      { value: "4", label: "Uppercase + lowercase + numbers + special characters" },
      { value: "3", label: "Some mix of letters and numbers" },
      { value: "2", label: "Just letters or numbers" },
      { value: "1", label: "A common word or personal name (e.g., birthday, pet)" },
    ],
  },
  {
    id: "q5",
    category: "Password Management",
    question: "How are passwords shared within your team or family?",
    options: [
      { value: "4", label: "Through a secure password-sharing feature in a manager" },
      { value: "2", label: "Verbally or via a messaging app (WhatsApp/Slack)" },
      { value: "1", label: "Shared via email" },
      { value: "3", label: "Not shared at all, everyone uses the same credentials" },
    ],
  },
  {
    id: "q6",
    category: "Authentication",
    question: "Which authentication method is used for logging into company systems?",
    options: [
      { value: "4", label: "Username + password + OTP or authenticator app" },
      { value: "2", label: "Username + password only" },
      { value: "3", label: "Biometric login only (fingerprint/face ID)" },
      { value: "1", label: "No authentication is required" },
    ],
  },
  {
    id: "q7",
    category: "Authentication",
    question: "Which of these best describes how multi-factor authentication (MFA) is used by you?",
    options: [
      { value: "4", label: "Enabled on all critical accounts (email, banking, work)" },
      { value: "3", label: "Enabled only on financial or work-related apps" },
      { value: "2", label: "Used rarely, only when enforced" },
      { value: "1", label: "Never used MFA" },
    ],
  },
  {
    id: "q8",
    category: "Device Security",
    question: "How do you verify the legitimacy of a file before opening it?",
    options: [
      { value: "4", label: "File type, sender authenticity, and antivirus scan" },
      { value: "3", label: "Only trust known senders" },
      { value: "1", label: "Open and see what happens" },
      { value: "1", label: "I don't know how to check file safety" },
    ],
  },
  {
    id: "q9",
    category: "Device Security",
    question: "How is your device protected when not in use?",
    options: [
      { value: "4", label: "Auto-lock enabled with strong password or biometric" },
      { value: "3", label: "Only screensaver or screen lock" },
      { value: "1", label: "No lock, anyone can use it" },
      { value: "2", label: "I manually lock it when I remember" },
    ],
  },
  {
    id: "q10",
    category: "Network Security",
    question: "How do you connect to the internet for work or personal use?",
    options: [
      { value: "4", label: "Secure, private Wi-Fi with WPA3 or WPA2 encryption" },
      { value: "2", label: "Home Wi-Fi with unchanged router password" },
      { value: "1", label: "Frequently use public Wi-Fi (cafes, malls, stations)" },
      { value: "3", label: "I use mobile hotspots most of the time" },
    ],
  },
]

const categories = {
  "Password Management": { icon: Lock, questions: ["q1", "q2", "q3", "q4", "q5"] },
  Authentication: { icon: Shield, questions: ["q6", "q7"] },
  "Device Security": { icon: Smartphone, questions: ["q8", "q9"] },
  "Network Security": { icon: Wifi, questions: ["q10"] },
}

export default function CybersecurityAssessment() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const calculateScores = () => {
    const categoryScores: Record<string, { score: number; total: number }> = {}

    Object.entries(categories).forEach(([category, { questions: categoryQuestions }]) => {
      let totalScore = 0
      let totalQuestions = 0

      categoryQuestions.forEach((questionId) => {
        if (answers[questionId]) {
          totalScore += Number.parseInt(answers[questionId])
          totalQuestions++
        }
      })

      categoryScores[category] = {
        score: totalQuestions > 0 ? totalScore / totalQuestions : 0,
        total: totalQuestions,
      }
    })

    const overallScore =
      Object.values(categoryScores).reduce((acc, { score, total }) => {
        return acc + score * total
      }, 0) / Object.values(categoryScores).reduce((acc, { total }) => acc + total, 0)

    return { categoryScores, overallScore }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const { categoryScores, overallScore } = calculateScores()
      const assessmentData = {
        answers,
        categoryScores,
        overallScore,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentData),
      })

      if (response.ok) {
        const result = await response.json()

        // Save to localStorage
        localStorage.setItem(
          `assessment_${result.id}`,
          JSON.stringify({
            _id: result.id,
            ...assessmentData,
          }),
        )

        router.push(`/report?id=${result.id}`)
      } else {
        throw new Error("Failed to submit assessment")
      }
    } catch (error) {
      console.error("Error submitting assessment:", error)
      alert("Failed to submit assessment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (Object.keys(answers).length / questions.length) * 100
  const isComplete = Object.keys(answers).length === questions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Shield className="h-12 w-12" />
              Cybersecurity Assessment
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Evaluate your organization's security posture and get personalized recommendations
            </p>
            <div className="bg-white/20 rounded-full p-3 inline-block">
              <span className="text-white font-medium">
                Generated on:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-medium">Progress</span>
              <span className="text-white font-medium">
                {Object.keys(answers).length}/{questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {/* Questions */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {questions.map((question, index) => {
              const IconComponent = categories[question.category as keyof typeof categories].icon

              return (
                <Card key={question.id} className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-gray-800">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="text-sm text-blue-600 font-medium">{question.category}</div>
                        <div className="text-lg">{question.question}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                    >
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => handleAnswerChange(question.id, option.value)}
                        >
                          <RadioGroupItem value={option.value} id={`${question.id}-${optionIndex}`} />
                          <Label
                            htmlFor={`${question.id}-${optionIndex}`}
                            className="flex-1 cursor-pointer font-medium text-gray-700"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating Report...
                </div>
              ) : isComplete ? (
                "Generate Security Report"
              ) : (
                `Answer ${questions.length - Object.keys(answers).length} more questions`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
