import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { signup } from "../../apis/auth.api";

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const message = params.get("message");
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (message === "error" && !hasShownToast.current) {
      toast.success("Token invalide ! Veuillez vous réinscrire");
      hasShownToast.current = true;
      navigate("/login", { replace: true });
    }
  }, [message, navigate]);
  const schema = yup.object({
    username: yup.string().required("Le champ est obligatoire"),
    email: yup
      .string()
      .email()
      .required("Le champ est obligatoire")
      .matches(
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        "Format de votre email non valide"
      ),
    password: yup
      .string()
      .required("Le champ est obligatoire")
      .min(5, "trop court")
      .max(10, "trop long"),
    confirmPassword: yup
      .string()
      .required("Le champ est obligatoire")
      .oneOf(
        [yup.ref("password"), ""],
        "Les mots de passes ne correspondent pas"
      ),
    rgpd: yup
      .boolean()
      .oneOf([true], "Vous devez accepter les termes et conditions"),
  });

  const defaultValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    rgpd: false,
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
      const feedback = await signup(values);
      // console.log(feedback);

      if (!feedback.message) {
        reset(defaultValues);
        toast.success(feedback.messageOk);
        navigate("/login");
      } else {
        toast.error(feedback.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex justify-center items-center">
      <div className="p-10 border bg-white shadow-xl rounded-xl">
        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col gap-2.5 items-center"
        >
          <div className="flex flex-col mb-2">
            <label htmlFor="username" className="mb-2.5 font-inter">
              Pseudo :
            </label>
            <input
              {...register("username")}
              type="text"
              id="username"
              placeholder="JohnDoe03"
              className="w-[300px] h-[30px] px-2.5 py-[5px] border rounded-sm"
            />
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="email" className="mb-2.5">
              Email :
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="john.doe@gmail.com"
              className="w-[300px] h-[30px] px-2.5 py-[5px] border rounded-sm"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
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
              className="w-[300px] h-[30px] px-2.5 py-[5px] border rounded-sm"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="confirmPassword" className="mb-2.5">
              Confirmation du mot de passe :
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              placeholder="**********"
              className="w-[300px] h-[30px] px-2.5 py-[5px] border rounded-sm"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="w-[300px] flex items-start gap-2.5 mb-2">
            <input
              {...register("rgpd")}
              type="checkbox"
              className="mt-[1px]"
              id="rgpd"
            />
            <label htmlFor="rgpd" className="w-fit text-xs">
              J'autorise ce site à conserver mes données personnelles transmises
              via ce formulaire. Aucune exploitation commerciale ne sera faite
              des données conservées.
            </label>
            {errors.rgpd && (
              <p className="text-red-500">{errors.rgpd.message}</p>
            )}
          </div>
          <button className="w-[150px] bg-primary-light hover:bg-primary-dark text-white hover:text-black px-4 py-2 rounded-lg cursor-pointer">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
