// src/layouts/RootLayout.jsx
import { Outlet } from "react-router";
import FooterComponent from "../components/footer/FooterComponent";
import NavbarComponent, {
  DarkModeProvider,
} from "../components/navbar/NavbarComponent";
import NavbarAfterLogin from "../components/navbar/NavbarAfterLogin";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthed, setUser } from "../features/auth/authSlice";
import { useMeQuery } from "../services/authApi";
import { useEffect } from "react";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import { useUserStatus } from "../hooks/useUserStatus";
import BannedScreen from "../components/common/BannedScreen";

const RootLayout = () => {
  const dispatch = useDispatch();
  const isAuthed = useSelector(selectIsAuthed);

  const { data, isSuccess } = useMeQuery(undefined, { skip: !isAuthed });

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setUser(data.data));
    }
  }, [isSuccess, data, dispatch]);


  const { isBanned, isSuspended, loading: statusLoading } = useUserStatus();

  if (isAuthed && !statusLoading && (isBanned || isSuspended)) {
    return <BannedScreen status={isBanned ? "BANNED" : "SUSPENDED"} />;
  }


  return (
    <>
      {isAuthed ? <NavbarAfterLogin /> : <NavbarComponent />}
      <Outlet />
      <FooterComponent />
      <ScrollToTopButton />
    </>
  );
};

export default RootLayout;