import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { getAllData } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { useAuthStore } from "@/store/auth-store";
import { useMeStore } from "@/store/me-store";
import { IUserData } from "@/types";

import useAuthMutation from "./actions";
import LoginFormContent from "./FormContent";
import { LoginFormType, LoginSchema } from "./schema";

const LoginForm = () => {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
  });

  const { setToken } = useAuthStore();
  const { setUserMe } = useMeStore();

  const { mutate, isPending } = useAuthMutation({
    onSuccess: (res) => {
      setToken(res?.accessToken);
      getAllData<IUserData, unknown>(apiRoutes.userMe).then((res) => {
        if (res) setUserMe(res);
        window.location.replace("/");
      });
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((data) => mutate(data))}>
        <LoginFormContent isPending={isPending} />
      </form>
    </FormProvider>
  );
};

export default LoginForm;
