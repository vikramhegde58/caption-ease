import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import uniqid from 'uniqid'

export async function POST(params: Request) {
    const formData = await params.formData()
    const file = formData.get('file') as File
    const {name} = file
    const data = await file.arrayBuffer()
    const id = uniqid()
    const ext = name.split('.').splice(-1)[0]
    const newName = `${id}.${ext}`

    const client = new S3Client({
        region: 'eu-north-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
        }
    })

    const uploadCommand = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME as string,
        Body: data as any,
        ACL: 'public-read',
        ContentType: file.type,
        Key: newName
    })

    await client.send(uploadCommand)

    return Response.json({name, id, ext, newName})
}
