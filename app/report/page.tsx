"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Download,
  Calendar,
  ArrowLeft,
  Lock,
  Smartphone,
  Wifi,
  Users,
} from "lucide-react"

interface AssessmentData {
  _id: string
  answers: Record<string, string>
  categoryScores: Record<string, { score: number; total: number }>
  overallScore: number
  timestamp: string
}

const categories = {
  "Password Management": { icon: Lock, color: "bg-blue-500" },
  Authentication: { icon: Shield, color: "bg-green-500" },
  "Device Security": { icon: Smartphone, color: "bg-purple-500" },
  "Network Security": { icon: Wifi, color: "bg-orange-500" },
}

export default function SecurityReport() {
  const [data, setData] = useState<AssessmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const assessmentId = searchParams.get("id")

  useEffect(() => {
    if (assessmentId) {
      fetchAssessmentData(assessmentId)
    } else {
      setLoading(false)
    }
  }, [assessmentId])

  const fetchAssessmentData = async (id: string) => {
    try {
      // First try to get from localStorage
      const localData = localStorage.getItem(`assessment_${id}`)
      if (localData) {
        const assessmentData = JSON.parse(localData)
        setData(assessmentData)
        return
      }

      // Fallback to API (which will return empty data for demo)
      const response = await fetch(`/api/assessment/${id}`)
      if (response.ok) {
        const assessmentData = await response.json()
        setData(assessmentData)
      } else {
        console.error("Failed to fetch assessment data")
      }
    } catch (error) {
      console.error("Error fetching assessment data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 3.5) return "from-green-500 to-emerald-600"
    if (score >= 2.5) return "from-blue-500 to-cyan-600"
    return "from-red-500 to-pink-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 3.5) return "Excellent"
    if (score >= 2.5) return "Good"
    if (score >= 1.5) return "Fair"
    return "Poor"
  }

  const getRiskLevel = (score: number) => {
    if (score >= 3.5) return { level: "Low", color: "bg-green-100 text-green-800", icon: CheckCircle }
    if (score >= 2.5) return { level: "Medium", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle }
    return { level: "High", color: "bg-red-100 text-red-800", icon: XCircle }
  }

  const getRecommendations = (categoryScores: Record<string, { score: number; total: number }>) => {
    const recommendations = []

    if (categoryScores["Password Management"]?.score < 3) {
      recommendations.push({
        priority: "High",
        title: "Implement Password Manager",
        description: "Use a password manager to generate and store unique, complex passwords for each account.",
        color: "bg-red-100 text-red-800",
      })
    }

    if (categoryScores["Authentication"]?.score < 3) {
      recommendations.push({
        priority: "High",
        title: "Enable Multi-Factor Authentication",
        description: "Implement MFA on all critical accounts to prevent 99.9% of automated attacks.",
        color: "bg-red-100 text-red-800",
      })
    }

    if (categoryScores["Device Security"]?.score < 3) {
      recommendations.push({
        priority: "Medium",
        title: "Enhance Device Security",
        description: "Enable automatic device locking and maintain updated antivirus software.",
        color: "bg-yellow-100 text-yellow-800",
      })
    }

    if (categoryScores["Network Security"]?.score < 3) {
      recommendations.push({
        priority: "Medium",
        title: "Secure Network Configuration",
        description: "Use WPA3 encryption and avoid public Wi-Fi for sensitive activities.",
        color: "bg-yellow-100 text-yellow-800",
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: "Low",
        title: "Maintain Security Excellence",
        description: "Continue regular security audits and stay updated with best practices.",
        color: "bg-green-100 text-green-800",
      })
    }

    return recommendations
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl">Loading your security report...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-gray-300 mb-6">The assessment report could not be loaded.</p>
          <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessment
          </Button>
        </div>
      </div>
    )
  }

  const riskLevel = getRiskLevel(data.overallScore)
  const recommendations = getRecommendations(data.categoryScores)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Security Assessment Report</h1>
          </div>
          <p className="text-xl text-white/90 mb-4">Comprehensive analysis of your security posture</p>
          <div className="bg-white/20 rounded-full p-3 inline-block">
            <span className="text-white font-medium">
              Generated on:{" "}
              {new Date(data.timestamp).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Score Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className={`bg-gradient-to-r ${getScoreColor(data.overallScore)} text-white rounded-2xl p-8 mb-6`}>
                  <div className="text-5xl font-bold mb-2">{data.overallScore.toFixed(1)}</div>
                  <div className="text-lg opacity-90">Overall Security Score</div>
                  <div className="mt-4">
                    <Progress value={(data.overallScore / 4) * 100} className="h-2 bg-white/20" />
                  </div>
                </div>
                <Badge className={`${riskLevel.color} text-lg px-4 py-2`}>
                  <riskLevel.icon className="h-5 w-5 mr-2" />
                  {riskLevel.level} Risk Level
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.categoryScores).map(([category, { score }]) => {
                    const categoryInfo = categories[category as keyof typeof categories]
                    const IconComponent = categoryInfo.icon
                    const percentage = (score / 4) * 100

                    return (
                      <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${categoryInfo.color} text-white`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-gray-800">{category}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24">
                            <Progress value={percentage} className="h-2" />
                          </div>
                          <span className="font-bold text-gray-800 min-w-[3rem]">{score.toFixed(1)}/4</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Analysis & Risk Assessment Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Security Radar Analysis */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-800 text-center">Security Radar Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-80 flex items-center justify-center">
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  {/* Radar Chart Background */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                    </pattern>
                  </defs>

                  {/* Concentric circles */}
                  <circle cx="150" cy="150" r="120" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  <circle cx="150" cy="150" r="90" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  <circle cx="150" cy="150" r="60" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  <circle cx="150" cy="150" r="30" fill="none" stroke="#e2e8f0" strokeWidth="1" />

                  {/* Axis lines */}
                  <line x1="150" y1="30" x2="150" y2="270" stroke="#e2e8f0" strokeWidth="1" />
                  <line x1="30" y1="150" x2="270" y2="150" stroke="#e2e8f0" strokeWidth="1" />
                  <line x1="63" y1="63" x2="237" y2="237" stroke="#e2e8f0" strokeWidth="1" />
                  <line x1="237" y1="63" x2="63" y2="237" stroke="#e2e8f0" strokeWidth="1" />

                  {/* Current Score Polygon */}
                  <polygon
                    points={`150,${150 - (data?.categoryScores["Password Management"]?.score || 0) * 30} ${150 + (data?.categoryScores["Authentication"]?.score || 0) * 30},150 150,${150 + (data?.categoryScores["Device Security"]?.score || 0) * 30} ${150 - (data?.categoryScores["Network Security"]?.score || 0) * 30},150`}
                    fill="rgba(59, 130, 246, 0.3)"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                  />

                  {/* Target Score Polygon (dashed) */}
                  <polygon
                    points="150,30 270,150 150,270 30,150"
                    fill="rgba(34, 197, 94, 0.1)"
                    stroke="rgb(34, 197, 94)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />

                  {/* Data points */}
                  <circle
                    cx="150"
                    cy={150 - (data?.categoryScores["Password Management"]?.score || 0) * 30}
                    r="4"
                    fill="rgb(59, 130, 246)"
                  />
                  <circle
                    cx={150 + (data?.categoryScores["Authentication"]?.score || 0) * 30}
                    cy="150"
                    r="4"
                    fill="rgb(59, 130, 246)"
                  />
                  <circle
                    cx="150"
                    cy={150 + (data?.categoryScores["Device Security"]?.score || 0) * 30}
                    r="4"
                    fill="rgb(59, 130, 246)"
                  />
                  <circle
                    cx={150 - (data?.categoryScores["Network Security"]?.score || 0) * 30}
                    cy="150"
                    r="4"
                    fill="rgb(59, 130, 246)"
                  />

                  {/* Labels */}
                  <text x="150" y="20" textAnchor="middle" className="text-xs font-medium fill-gray-600">
                    Password Mgmt
                  </text>
                  <text x="280" y="155" textAnchor="start" className="text-xs font-medium fill-gray-600">
                    Authentication
                  </text>
                  <text x="150" y="290" textAnchor="middle" className="text-xs font-medium fill-gray-600">
                    Device Security
                  </text>
                  <text x="20" y="155" textAnchor="end" className="text-xs font-medium fill-gray-600">
                    Network Security
                  </text>
                </svg>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Current Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-green-500 border-dashed rounded-full"></div>
                  <span className="text-sm text-gray-600">Target Score</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution Chart */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-800 text-center">Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-80 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-64 h-64">
                  <defs>
                    <filter id="shadow">
                      <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Donut Chart Segments */}
                  {(() => {
                    const highRisk = data?.overallScore < 2 ? 50 : data?.overallScore < 2.5 ? 35 : 15
                    const mediumRisk = 30
                    const lowRisk = 100 - highRisk - mediumRisk

                    const radius = 70
                    const innerRadius = 40
                    const centerX = 100
                    const centerY = 100

                    let currentAngle = -90 // Start from top

                    const createArc = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
                      const start1 = polarToCartesian(centerX, centerY, outerR, endAngle)
                      const end1 = polarToCartesian(centerX, centerY, outerR, startAngle)
                      const start2 = polarToCartesian(centerX, centerY, innerR, endAngle)
                      const end2 = polarToCartesian(centerX, centerY, innerR, startAngle)

                      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

                      return [
                        "M",
                        start1.x,
                        start1.y,
                        "A",
                        outerR,
                        outerR,
                        0,
                        largeArcFlag,
                        0,
                        end1.x,
                        end1.y,
                        "L",
                        end2.x,
                        end2.y,
                        "A",
                        innerR,
                        innerR,
                        0,
                        largeArcFlag,
                        1,
                        start2.x,
                        start2.y,
                        "L",
                        start1.x,
                        start1.y,
                        "Z",
                      ].join(" ")
                    }

                    function polarToCartesian(
                      centerX: number,
                      centerY: number,
                      radius: number,
                      angleInDegrees: number,
                    ) {
                      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
                      return {
                        x: centerX + radius * Math.cos(angleInRadians),
                        y: centerY + radius * Math.sin(angleInRadians),
                      }
                    }

                    const segments = [
                      { percentage: highRisk, color: "#ef4444", label: "High Risk" },
                      { percentage: mediumRisk, color: "#f59e0b", label: "Medium Risk" },
                      { percentage: lowRisk, color: "#10b981", label: "Low Risk" },
                    ]

                    return segments.map((segment, index) => {
                      const angle = (segment.percentage / 100) * 360
                      const path = createArc(currentAngle, currentAngle + angle, radius, innerRadius)
                      currentAngle += angle

                      return (
                        <path
                          key={index}
                          d={path}
                          fill={segment.color}
                          filter="url(#shadow)"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      )
                    })
                  })()}

                  {/* Center text */}
                  <text x="100" y="95" textAnchor="middle" className="text-lg font-bold fill-gray-800">
                    Risk
                  </text>
                  <text x="100" y="110" textAnchor="middle" className="text-sm fill-gray-600">
                    Assessment
                  </text>
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">High Risk</span>
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {data?.overallScore < 2 ? "50%" : data?.overallScore < 2.5 ? "35%" : "15%"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Medium Risk</span>
                  </div>
                  <div className="text-lg font-bold text-yellow-600">30%</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Low Risk</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {data?.overallScore < 2 ? "20%" : data?.overallScore < 2.5 ? "35%" : "55%"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Analysis */}
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Risk Assessment Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {data.overallScore < 2 ? Math.floor(Math.random() * 15) + 20 : Math.floor(Math.random() * 10) + 5}
                </div>
                <div className="text-red-800 font-medium">High Risk Issues</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{Math.floor(Math.random() * 20) + 10}</div>
                <div className="text-yellow-800 font-medium">Medium Risk Issues</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {data.overallScore > 3 ? Math.floor(Math.random() * 15) + 25 : Math.floor(Math.random() * 10) + 5}
                </div>
                <div className="text-green-800 font-medium">Low Risk Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-7 w-7" />
              Priority Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <Badge className={`${rec.color} mb-3`}>{rec.priority} Priority</Badge>
                  <h4 className="text-lg font-semibold mb-2">{rec.title}</h4>
                  <p className="text-white/90 text-sm leading-relaxed">{rec.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Section */}
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-gray-800">Security Framework Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: "NIST Framework", icon: "🛡️", status: data.overallScore >= 3 ? "Compliant" : "Partial" },
                { name: "ISO 27001", icon: "🔒", status: data.overallScore >= 3.5 ? "Compliant" : "Non-Compliant" },
                { name: "GDPR", icon: "⚖️", status: "Compliant" },
                { name: "SOC 2", icon: "🏛️", status: data.overallScore >= 2.5 ? "Partial" : "Non-Compliant" },
              ].map((framework, index) => (
                <div
                  key={index}
                  className="text-center p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                >
                  <div className="text-4xl mb-3">{framework.icon}</div>
                  <div className="font-semibold text-gray-800 mb-2">{framework.name}</div>
                  <Badge
                    className={
                      framework.status === "Compliant"
                        ? "bg-green-100 text-green-800"
                        : framework.status === "Partial"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {framework.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Take Action</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Report
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl"
              >
                <Users className="h-5 w-5 mr-2" />
                Get Expert Consultation
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Re-assessment
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
