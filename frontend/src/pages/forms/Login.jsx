import { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { signin } from "../../apis/auth.api";
import Bouton from "../../components/Boutons/Bouton";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [params] = useSearchParams();
  const message = params.get("message");
  const hasShownToast = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (message === "success" && !hasShownToast.current) {
      toast.success("Inscription Validée ! Vous pouvez vous connecter");
      hasShownToast.current = true;
      navigate("/login", { replace: true });
    }
  }, [message, navigate]);

  const schema = yup.object({
    username: yup.string().required("Le champ est obligatoire"),
    password: yup.string().required("Le champ est obligatoire"),
  });

  const defaultValues = {
    username: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  async function submit(values) {
    console.log(values);
    try {
      const response = await signin(values);
      console.log(response);

      if (!response.message) {
        reset(defaultValues);
        toast.success("Connexion réussie");
        login(response);
        navigate("/");
      } else {
        toast.error("Connexion échouée");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex justify-center items-center">
      <div className="p-10 max-sm:p-4 border bg-white shadow-xl rounded-xl dark:bg-gray-900">
        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col gap-2.5 items-center"
        >
          <div className="flex flex-col mb-2">
            <label htmlFor="username" className="mb-2.5">
              Pseudo :
            </label>
            <input
              {...register("username")}
              type="text"
              id="username"
              placeholder="JohnDoe03"
              className="w-[300px] h-[30px] px-2.5 py-[5px] border rounded-sm placeholder:text-secondary-text-light dark:placeholder:text-secondary-text-dark"
            />
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="password" className="mb-2.5">
              Mot de passe :
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="**********"
              className="w-[300px] h-[30px] px-2.5 py-[5px] border rounded-sm placeholder:text-secondary-text-light dark:placeholder:text-secondary-text-dark"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex w-full gap-1 text-xs mb-2">
            <p>Pas encore de compte ?</p>
            <Link
              to="/login"
              className="text-primary-light hover:text-primary-dark dark:text-primary-dark dark:hover:text-primary-light"
            >
              Inscrivez vous !
            </Link>
          </div>
          <Bouton text="Se connecter" />
        </form>
      </div>
    </div>
  );
}
