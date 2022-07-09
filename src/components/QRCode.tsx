import { QRCodeSVG } from "qrcode.react";

export const QRCode = ({ url }: { url: string }) => {
  return (
    <div className="modal  modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-2xl">This game requires touch-screen!</h3>
        <p className="py-4">
          Please scan below QR code with your mobile device.
        </p>
        <div className="flex justify-center">
          <QRCodeSVG value={url} height={300} width={300} />
        </div>
      </div>
    </div>
  );
};
