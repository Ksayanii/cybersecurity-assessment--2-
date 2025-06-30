"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Users, Star, CheckCircle, ArrowLeft } from "lucide-react"

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    phone: "",
    companySize: "",
    industry: "",
    securityChallenges: "",
    newsletter: false,
    terms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const signupData = {
        ...formData,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      })

      if (response.ok) {
        const result = await response.json()

        // Save to localStorage
        localStorage.setItem(
          `signup_${result.id}`,
          JSON.stringify({
            _id: result.id,
            ...signupData,
          }),
        )

        // Also save to a general signups array for potential future use
        const existingSignups = JSON.parse(localStorage.getItem("all_signups") || "[]")
        existingSignups.push({
          _id: result.id,
          ...signupData,
        })
        localStorage.setItem("all_signups", JSON.stringify(existingSignups))

        setSubmitted(true)
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/95 backdrop-blur-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your information has been submitted successfully. Our cybersecurity experts will contact you within 24
              hours to discuss your security needs.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push("/")} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Take Another Assessment
              </Button>
              <Button onClick={() => router.push("/report")} variant="outline" className="w-full">
                View Sample Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Shield className="h-12 w-12" />
              Get Expert Security Consultation
            </h1>
            <p className="text-xl text-white/90">
              Connect with our cybersecurity experts to strengthen your security posture
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-700 font-medium">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-700 font-medium">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company" className="text-gray-700 font-medium">
                        Company *
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobTitle" className="text-gray-700 font-medium">
                        Job Title *
                      </Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companySize" className="text-gray-700 font-medium">
                        Company Size
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("companySize", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="industry" className="text-gray-700 font-medium">
                        Industry
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("industry", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="securityChallenges" className="text-gray-700 font-medium">
                      Current Security Challenges (Optional)
                    </Label>
                    <Textarea
                      id="securityChallenges"
                      value={formData.securityChallenges}
                      onChange={(e) => handleInputChange("securityChallenges", e.target.value)}
                      placeholder="Describe your main cybersecurity concerns or challenges..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => handleInputChange("newsletter", checked as boolean)}
                      />
                      <Label htmlFor="newsletter" className="text-sm text-gray-600">
                        Subscribe to our cybersecurity newsletter for latest threats and best practices
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.terms}
                        onCheckedChange={(checked) => handleInputChange("terms", checked as boolean)}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the Terms of Service and Privacy Policy *
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.terms}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Submitting...
                        </div>
                      ) : (
                        "Get Expert Consultation"
                      )}
                    </Button>
                    <Button type="button" onClick={() => router.back()} variant="outline" className="px-6">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  Why Choose Our Experts?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Certified Professionals</div>
                    <div className="text-sm text-gray-600">CISSP, CISM, and CEH certified experts</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">AI Support</div>
                    <div className="text-sm text-gray-600">Comprehensive chatbot to solve your doubts</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Custom Solutions</div>
                    <div className="text-sm text-gray-600">Tailored to your industry and size</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">Proven Track Record</div>
                    <div className="text-sm text-gray-600"> Countless successful implementations</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 mx-auto mb-4" />
                <div className="text-2xl font-bold mb-2">Expert Consultation</div>
                <div className="text-green-100 text-sm">
                  Get a 30-minute one-on-one consultation with our cybersecurity experts
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">What You'll Get</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Detailed security assessment report
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Personalized recommendations
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Implementation roadmap
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Ongoing support options
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
