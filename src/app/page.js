"use client";
import { useRouter } from 'next/navigation'
import styles from "@/app/styles/page.module.css";
import Image from 'next/image';
import Header from "@/app/components/header";

export default function Home() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/boardAI');
  };

  return (
    <>
      <Header/>
      <div className={styles.containerImage}>
        <Image className={styles.image} src="/xo_logo.jpg" width={300} height={300} alt='logo' />
      </div>
      <div className={styles.containerButton}>
        <button onClick={handleButtonClick}>Game Start</button>
      </div>
    
    </>
  );
}
