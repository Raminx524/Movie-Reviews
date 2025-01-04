import React from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div>
      LoginPage
      <Link to="/auth/register">Register</Link>
    </div>
  );
}

export default LoginPage;
