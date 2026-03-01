import { Outlet } from "react-router";
import FooterComponent from "../components/footer/FooterComponent";
import NavbarComponent, { DarkModeProvider } from "../components/navbar/NavbarComponent";
import NavbarAfterLogin from "../components/navbar/NavbarAfterLogin";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthed, setUser } from "../features/auth/authSlice";
import { useMeQuery } from "../services/authApi";
import { useEffect } from "react";
import ScrollToTopButton from "../components/common/ScrollToTopButton";

const RootLayout = () => {
   const dispatch = useDispatch();
  const isAuthed = useSelector(selectIsAuthed);

  // fetch /me only if logged in
  const { data, isSuccess } = useMeQuery(undefined, { skip: !isAuthed });

  useEffect(() => {
    // your API returns { success, message, data: {...user} }
    if (isSuccess && data?.data) {
      dispatch(setUser(data.data));
    }
  }, [isSuccess, data, dispatch]);
  return (
    <DarkModeProvider>
      {isAuthed ? <NavbarAfterLogin /> : <NavbarComponent />}
        
        <Outlet />
      
      <FooterComponent />
      <ScrollToTopButton />
    </DarkModeProvider>
  );
};

export default RootLayout;
