"use client";

import { Toaster as HotToaster } from "react-hot-toast";
import styles from "./styles.module.css";

export function Toaster() {
	return (
		<HotToaster
			position="bottom-right"
			containerClassName={styles.toasterContainer}
			toastOptions={{
				duration: 3000,
				className: styles.toasterDefault,
				loading: { className: styles.toasterLoading },
				success: { className: styles.toasterSuccess },
				error: { className: styles.toasterError },
			}}
		/>
	);
}
