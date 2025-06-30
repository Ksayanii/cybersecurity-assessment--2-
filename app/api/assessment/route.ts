import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, categoryScores, overallScore, timestamp } = body

    // Generate a simple ID for local storage
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)

    // In a real app, this would be saved to MongoDB
    // For now, we'll just return the ID and let the frontend handle local storage

    return NextResponse.json({
      success: true,
      id: id,
      data: {
        answers,
        categoryScores,
        overallScore,
        timestamp,
      },
    })
  } catch (error) {
    console.error("Error processing assessment:", error)
    return NextResponse.json({ error: "Failed to process assessment" }, { status: 500 })
  }
}
