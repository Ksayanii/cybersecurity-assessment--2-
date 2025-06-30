import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In a real app, this would fetch from MongoDB
    // For now, we'll return a mock response that the frontend will override with localStorage data

    return NextResponse.json({
      _id: id,
      answers: {},
      categoryScores: {},
      overallScore: 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching assessment:", error)
    return NextResponse.json({ error: "Failed to fetch assessment" }, { status: 500 })
  }
}
