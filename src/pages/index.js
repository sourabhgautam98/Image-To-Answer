// pages/index.js
import Head from 'next/head';
import OCRUpload from '@/components/OCRUpload';

export default function Home() {
  return (
    <div>
      <Head>
        <title>OCR with Tesseract.js</title>
      </Head>
     
        <OCRUpload />
     
    </div>
  );
}
