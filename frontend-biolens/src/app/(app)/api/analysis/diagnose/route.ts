import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const cropId = formData.get('cropId')
        const image = formData.get('image')

        if (!cropId || !image) {
            return NextResponse.json({ message: 'cropId and image are required.' }, { status: 400 })
        }

        const backendFormData = new FormData()
        backendFormData.append('image', image)

        const response = await fetch(`${BACKEND_URL}/api/crops/diagnose/${cropId}`, {
            method: 'POST',
            body: backendFormData,
            cache: 'no-store',
        })

        if (!response.ok) {
            const text = await response.text()
            return NextResponse.json(
                { message: text || 'Backend diagnosis request failed.' },
                { status: response.status }
            )
        }

        const payload = await response.json()
        return NextResponse.json(payload)
    } catch {
        return NextResponse.json({ message: 'Unexpected error while diagnosing crop.' }, { status: 500 })
    }
}
