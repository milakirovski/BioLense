import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

export async function GET() {
    try {
        const [cropsRes, diagnosesRes] = await Promise.all([
            fetch(`${BACKEND_URL}/api/crops/all`, { cache: 'no-store' }),
            fetch(`${BACKEND_URL}/api/crops/diagnoses`, { cache: 'no-store' }),
        ])

        if (!cropsRes.ok || !diagnosesRes.ok) {
            return NextResponse.json({ message: 'Failed to load analysis metadata.' }, { status: 502 })
        }

        const [crops, diagnoses] = await Promise.all([cropsRes.json(), diagnosesRes.json()])

        return NextResponse.json({ crops, diagnoses })
    } catch {
        return NextResponse.json({ message: 'Unexpected error loading analysis metadata.' }, { status: 500 })
    }
}
