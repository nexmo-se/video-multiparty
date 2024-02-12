import { DEVICE_ACCESS_STATUS } from './../constants';

const askDeviceMessage = 'To join the video room, your browser will request access to your cam and mic.';
const deniedDeviceMessage = 'It seems your browser is blocked from accessing your camera and/or microphone';

export default function DeviceAccessAlert({ accessStatus }) {
  const messageToDisplay = accessStatus === DEVICE_ACCESS_STATUS.PENDING ? askDeviceMessage : deniedDeviceMessage;
  const imgToDisplay =
    accessStatus === DEVICE_ACCESS_STATUS.PENDING ? '/images/access-dialog-pending.png' : '/images/access-dialog-rejected.png';
  return (
    <div className="absolute top-[0px] left-[0px] right-[400px] bottom-[100px] text-center">
      <div className="absolute flex flex-col justify-center inset-x-1/2 bg-rose-50 inset-y-1/2 w-1/2 h-1/2 ">
        <h2 className="text-3xl w-2/3 color-white">{messageToDisplay}</h2>
        <img src={imgToDisplay} alt="Access Dialog" className="w-full-screen max-w-sm"></img>
      </div>
    </div>
  );
}
