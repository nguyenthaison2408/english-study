import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import { VocProvider } from './contexts/VocalContext';
import { ChatProvider } from './contexts/ChatContext';

// User Pages
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Listening from './components/Pages/Listening';
import Reading from './components/Pages/Reading';
import Writting from './components/Pages/Writting';
import Speaking from './components/Pages/Speaking';
import Vocab from './components/Vocab/VocabPage';
import ChatApp from './components/User/Chat/ChatApp';
import HomePage from './components/User/HomePage';
import UserProfile from './components/User/UserProfile';
import CourseDetailPage from './components/User/CourseDetailPage';
import VocabularyPage from './components/User/VocabularyPage';
import Vocab2 from './components/User/Vocab2';
import Forum from './components/Forum/Forum';
import ChatPage from './components/User/ChatPage';
import QuizResult from './components/User/QuizResult';

// Exam
import ExamPage from './components/User/ExamPage';
import TakeExamPart1 from './components/User/TakeExamPart1';
import TakeExamPart2 from './components/User/TakeExamPart2';
import TakeExamPart3 from './components/User/TakeExamPart3';
import TakeExamPart4 from './components/User/TakeExamPart4';
import TakeExamPart5 from './components/User/TakeExamPart5';
import TakeExamPart6 from './components/User/TakeExamPart6';
import TakeExamPart7 from './components/User/TakeExamPart7';
import TakeExamFullTest from './components/User/TakeExamFullTest';

// TOEIC
import ToeicPage from './components/ToeicTest/ToeicPage';
import TestFullPage from './components/ToeicTest/TestFullPage';
import Part1Page from './components/ToeicTest/Part1Page';
import Part2Page from './components/ToeicTest/Part2Page';
import Part3Page from './components/ToeicTest/Part3Page';
import Part4Page from './components/ToeicTest/Part4Page';
import Part5Page from './components/ToeicTest/Part5Page';
import Part6Page from './components/ToeicTest/Part6Page';
import Part7Page from './components/ToeicTest/Part7Page';

// Assignment
import Part1Detail from './components/Assignment/Part1Detail';
import Part2Detail from './components/Assignment/Part2Detail';
import Part3Detail from './components/Assignment/Part3Detail';
import Part4Detail from './components/Assignment/Part4Detail';
import Part5Detail from './components/Assignment/Part5Detail';
import Part6Detail from './components/Assignment/Part6Detail';
import Part7Detail from './components/Assignment/Part7Detail';
import FullTestDetail from './components/Assignment/FullTestDetail';

// Auth & Admin
import Authentication from './core/Authentication';
import AdminAuthentication from './core/AdminAuthentication';
import AdminLogin from './components/Admin/AdminLogin';
import AdminRegister from './components/Admin/AdminRegister';
import Admin from './components/Admin/Admin';
import Dashboard from './components/Admin/Content/DashBoard';
import ManageUser from './components/Admin/Content/ManageUser';
import ManageQuiz from './components/Admin/Content/ManageQuiz';
import QuizListByPart from './components/Admin/Content/QuizListByPart';

// Admin Quiz
import CreateQuizPart1 from './components/Admin/Content/Quiz/CreateQuizPart1';
import CreateQuizPart2 from './components/Admin/Content/Quiz/CreateQuizPart2';
import CreateQuizPart3 from './components/Admin/Content/Quiz/CreateQuizPart3';
import CreateQuizPart4 from './components/Admin/Content/Quiz/CreateQuizPart4';
import CreateQuizPart5 from './components/Admin/Content/Quiz/CreateQuizPart5';
import CreateQuizPart6 from './components/Admin/Content/Quiz/CreateQuizPart6';
import CreateQuizPart7 from './components/Admin/Content/Quiz/CreateQuizPart7';
import CreateFullTest from './components/Admin/Content/Quiz/CreateFullTest';
import { SocketProvider } from './contexts/SocketContext';
import { PaymentProvider } from './contexts/PaymentContext';
import PaymentCallback from './components/payment/PaymentCallback';
import ManagePay from './components/Admin/adminPay/ManagePay';

// SỬA LẠI INDEX.JS NHƯ SAU:

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <AuthProvider>
      <PostProvider>
        <VocProvider>
          <ChatProvider>
            <SocketProvider>
              <PaymentProvider>
            <React.StrictMode>
              <BrowserRouter>
                <Routes>

                  {/* APP LAYOUT */}
                  <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="listening" element={<Listening />} />
                    <Route path="reading" element={<Reading />} />
                    <Route path="writting" element={<Writting />} />
                    <Route path="speaking" element={<Speaking />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="vocab" element={<Vocab />} />
                  </Route>

                  {/* USER */}
                  <Route path="/chatapp" element={<Authentication><ChatApp /></Authentication>} />
                  <Route path="/homepage" element={<Authentication><HomePage /></Authentication>} />
                  <Route path="/chatpage" element={<ChatPage />} />
                  <Route path="/userprofile" element={<Authentication><UserProfile /></Authentication>} />
                  <Route path="/vocab2" element={<Vocab2 />} />
                  <Route path="/course" element={<CourseDetailPage />} />
                  <Route path="/vocab-page" element={<VocabularyPage />} />
                  <Route path="/forum" element={<Forum />} />

                  {/* EXAM */}
                  <Route path="/exams" element={<ExamPage />} />
                  <Route path="/quiz-result/:id" element={<QuizResult />} />
                  
                  <Route path="/test-part1/:id" element={<TakeExamPart1 />} />
                  <Route path="/test-part2/:id" element={<TakeExamPart2 />} />
                  <Route path="/test-part3/:id" element={<TakeExamPart3 />} />
                  <Route path="/test-part4/:id" element={<TakeExamPart4 />} />
                  <Route path="/test-part5/:id" element={<TakeExamPart5 />} />
                  <Route path="/test-part6/:id" element={<TakeExamPart6 />} />
                  <Route path="/test-part7/:id" element={<TakeExamPart7 />} />
                  <Route path="/test-full/:id" element={<TakeExamFullTest />} />

                  {/* PAYMENT - THÊM Ở ĐÂY, NGOÀI ADMIN */}
                  <Route path="/payment-callback" element={<Authentication><PaymentCallback /></Authentication>} />

                  {/* TOEIC */}
                  <Route path="/toeic-prep" element={<ToeicPage />} />
                  <Route path="/test-full" element={<TestFullPage />} />
                  <Route path="/toeic/part1" element={<Part1Page />} />
                  <Route path="/toeic/part2" element={<Part2Page />} />
                  <Route path="/toeic/part3" element={<Part3Page />} />
                  <Route path="/toeic/part4" element={<Part4Page />} />
                  <Route path="/toeic/part5" element={<Part5Page />} />
                  <Route path="/toeic/part6" element={<Part6Page />} />
                  <Route path="/toeic/part7" element={<Part7Page />} />

                  {/* ASSIGNMENT */}
                  <Route path="/part1/detail/:id" element={<Part1Detail />} />
                  <Route path="/part2/detail/:id" element={<Part2Detail />} />
                  <Route path="/part3/detail/:id" element={<Part3Detail />} />
                  <Route path="/part4/detail/:id" element={<Part4Detail />} />
                  <Route path="/part5/detail/:id" element={<Part5Detail />} />
                  <Route path="/part6/detail/:id" element={<Part6Detail />} />
                  <Route path="/part7/detail/:id" element={<Part7Detail />} />
                  <Route path="/fulltest/detail/:id" element={<FullTestDetail />} />

                  {/* ADMIN */}
                  <Route path="/adminlogin" element={<AdminLogin />} />
                  <Route path="/adminregister" element={<AdminRegister />} />
                  <Route path="/admin" element={<AdminAuthentication><Admin /></AdminAuthentication>}>
                    <Route index element={<Dashboard />} />
                    <Route path="manage-users" element={<ManageUser />} />
                    <Route path="manage-quiz" element={<ManageQuiz />} />
                    <Route path="manage-pay" element={<ManagePay />} />
                    <Route path="manage-quiz/part/:partNumber" element={<QuizListByPart />} />
                    
                    {/* CREATE QUIZ ROUTES */}
                    <Route path="create-quiz-part1" element={<CreateQuizPart1 />} />
                    <Route path="create-quiz-part2" element={<CreateQuizPart2 />} />
                    <Route path="create-quiz-part3" element={<CreateQuizPart3 />} />
                    <Route path="create-quiz-part4" element={<CreateQuizPart4 />} />
                    <Route path="create-quiz-part5" element={<CreateQuizPart5 />} />
                    <Route path="create-quiz-part6" element={<CreateQuizPart6 />} />
                    <Route path="create-quiz-part7" element={<CreateQuizPart7 />} />
                    <Route path="create-full-test" element={<CreateFullTest />} />
                    
                   
                    
                    {/* EDIT/UPDATE QUIZ ROUTES */}
                    <Route path="update-quiz-part1/:id" element={<CreateQuizPart1 />} />
                    <Route path="update-quiz-part2/:id" element={<CreateQuizPart2 />} />
                    <Route path="update-quiz-part3/:id" element={<CreateQuizPart3 />} />
                    <Route path="update-quiz-part4/:id" element={<CreateQuizPart4 />} />
                    <Route path="update-quiz-part5/:id" element={<CreateQuizPart5 />} />
                    <Route path="update-quiz-part6/:id" element={<CreateQuizPart6 />} />
                    <Route path="update-quiz-part7/:id" element={<CreateQuizPart7 />} />
                    <Route path="update-full-test/:id" element={<CreateFullTest />} />
                  </Route>

                </Routes>
              </BrowserRouter>

              <ToastContainer position="top-right" autoClose={3000} />
            </React.StrictMode>
            </PaymentProvider>
            </SocketProvider>
          </ChatProvider>
        </VocProvider>
      </PostProvider>
    </AuthProvider>
  </Provider>
);