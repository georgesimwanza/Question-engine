import Image from "next/image";
import styles from "./page.module.css";
import Register from "./AuthPage/authpage";
import Form from "./forms/form";
import TemplatePage from "./template_page/template";
import AuthPage from "./AuthPage/authpage";
import ResponsesPage from "./responses/[formId]/page";
import FillFormPage from "./Fill_out/[formId]/page";
export default function Home() {
  return (
    <FillFormPage/>
  );
}
