import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {
    GetTranscriptionJobCommand,
    StartTranscriptionJobCommand,
    TranscribeClient
} from '@aws-sdk/client-transcribe'

function getClient() {
    return new TranscribeClient({
        region: 'eu-north-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
        }
    })
}

function getCommand(fileName: string) {
    return new StartTranscriptionJobCommand({
        TranscriptionJobName: fileName as string,
        Media: {
            MediaFileUri: `s3://${process.env.BUCKET_NAME}/${fileName}`
        },
        OutputKey: fileName + '.transcription',
        IdentifyLanguage: true,
        OutputBucketName: process.env.BUCKET_NAME as string
    })
}

async function getJob(fileName: string) {
    const transcribeClient = getClient()
    let jobStatusResult = null
    try {
        const transcriptionJobStatusCommand = new GetTranscriptionJobCommand({
            TranscriptionJobName: fileName
        })
        jobStatusResult = await transcribeClient.send(transcriptionJobStatusCommand)
    } catch (e) {}
    return jobStatusResult
}

async function streamToString(stream: any) {
    const chunks: any = []
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)))
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
        stream.on('error', reject)
    })
}

async function getTranscriptionFile(fileName: string) {
    const transcriptionFileName = fileName + '.transcription'
    const client = new S3Client({
        region: 'eu-north-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
        }
    })
    const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME as string,
        Key: transcriptionFileName
    })
    let transcriptionFileResponse = null
    try {
        transcriptionFileResponse = await client.send(getObjectCommand)
    } catch (e) {}
    if (transcriptionFileResponse) {
        return JSON.parse((await streamToString(transcriptionFileResponse.Body)) as any)
    }
    return null
}

export async function GET(params: Request) {
    const url = new URL(params.url)
    const searchUrl = new URLSearchParams(url.searchParams)
    const fileName = searchUrl.get('fileName')

    const transcription = await getTranscriptionFile(fileName as string)
    if (transcription) {
        return Response.json({
            status: 'COMPLETED',
            transcription,
            error: null
        })
    }

    const transcriptionJob = await getJob(fileName as string)
    if (transcriptionJob) {
        return Response.json({
            status: transcriptionJob?.TranscriptionJob?.TranscriptionJobStatus,
            transcription: null,
            error: transcriptionJob.TranscriptionJob?.FailureReason
        })
    }

    if (!transcriptionJob) {
        const client = getClient()
        const command = getCommand(fileName as string)
        const job = await client.send(command)
        return Response.json({
            status: job?.TranscriptionJob?.TranscriptionJobStatus,
            transcription: null,
            error: job.TranscriptionJob?.FailureReason
        })
    }

    return Response.json(null)
}
