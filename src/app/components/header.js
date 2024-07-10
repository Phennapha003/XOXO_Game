"use client"
import React, { useState } from 'react';
import styles from "@/app/styles/header.module.css" // Adjust the path accordingly


function Header() {
    return (
        <header className={styles.Header}>
            <div className={styles.Text}>
                XOXO
            </div>
        </header>
    );
}

export default Header;