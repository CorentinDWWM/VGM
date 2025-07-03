import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { passwordReset } from "../../../apis/auth.api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const schema = yup.object({
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
  });

  const defaultValues = {
    password: "",
    confirmPassword: "",
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
    try {
      const feedback = await passwordReset({
        password: values.password,
        token,
      });
      if (!feedback.message) {
        reset(defaultValues);
        toast.success(feedback.messageOk);
        navigate("/login");
      } else {
        toast.error(feedback.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded">
        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col gap-4 mb-6 mx-auto max-w-[400px]"
        >
          <div className="flex flex-col mb-2">
            <label htmlFor="password" className="mb-2">
              Mot de passe
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="border border-gray-300 rounded px-3 py-2 focus: outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="confirmPassword" className="mb-2">
              Confirmation du mot de passe
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              className="border border-gray-300 rounded px-3 py-2 focus: outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
            Changer le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}
