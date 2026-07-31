import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const { otpInfo, handleOtpInfo, verifyOtp, resendOtp } =
    useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Verify Email</h3>

        <p className="text-center text-muted">
          OTP sent to
          <br />
          <strong>{otpInfo.email}</strong>
        </p>

        <input
          type="text"
          className="form-control mb-3 text-center"
          placeholder="Enter 6-digit OTP"
          name="otp"
          maxLength="6"
          value={otpInfo.otp}
          onChange={handleOtpInfo}
        />

        <button
          className="btn btn-primary w-100 mb-2"
          onClick={() => verifyOtp(navigate)}
          disabled={otpInfo.otp.length !== 6}
        >
          Verify OTP
        </button>

        <button className="btn btn-link w-100" onClick={resendOtp}>
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;