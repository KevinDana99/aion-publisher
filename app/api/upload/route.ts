import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const isVideo = file.type.startsWith('video/')

    const uploadResult: any = await new Promise((resolve, reject) => {
      const options: any = {
        folder: 'aion-publisher',
      }

      if (isVideo) {
        options.resource_type = 'video'
        options.transformation = [
          { width: 1080, height: 1920, crop: 'fill', aspect_ratio: '9:16' }
        ]
      } else {
        options.resource_type = 'image'
      }

      cloudinary.uploader.upload(
        base64,
        options,
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: isVideo ? 'video' : 'image',
      duration: uploadResult.duration
    })

  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}
