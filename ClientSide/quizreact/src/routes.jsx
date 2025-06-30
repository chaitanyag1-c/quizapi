import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import SignInPage from "./pages/Authorization/SignInPage";
import SignUpPage from "./pages/Authorization/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/Header";
import QuizList from "./pages/Admin/QuizList";
import QuizCategory from "./pages/Quiz/QuizCategory";
import QuizAttempt from "./pages/Quiz/QuizAttempt";
import QuizAttemptList from "./pages/Quiz/QuizAttemptList";
import QuizAttemptDetails from "./pages/Quiz/QuizAttemptDetails";
import QuizCreate from "./pages/Quiz/QuizCreate";
import QuizCategoryEdit from "./pages/Quiz/QuizCategoryEdit";
import EditQuestion from "./pages/Quiz/EditQuestion";
import ShowUser from "./pages/User/ShowUser";
const AppRoutes = () => {
  return (
    <>
    <Header/>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/list_all_questions/:id" element={<QuizList />} />
      <Route path="/list_quiz_category" element={<QuizCategory />} />
      <Route path="/take_quiz/:id" element={<QuizAttempt />} />
      <Route path="/view_attempts" element={<QuizAttemptList />} />
      <Route path="create_quiz" element={<QuizCreate/>}/>
      <Route path="show_quiz_category" element={<QuizCategoryEdit/>}/>
      <Route path="/view_quiz_attempt_details/:id" element={<QuizAttemptDetails/>}/>
      <Route path="/edit_question/:questionId" element={<EditQuestion/>}/>
      <Route path="/user/:id" element={<ShowUser/>}/>
      <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for 404 */}
    </Routes>
    </>
  );
};

export default AppRoutes;
