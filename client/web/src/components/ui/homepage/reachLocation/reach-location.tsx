import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { useNecessary } from "../../../../hooks/necessary";
import SuccessSnackbar from "../../../../hooks/successSnackbar";
import { placeReward } from "../../../../models/placeReward";
import useApi from "../../../../requestProvider/apiHandler";
import ErrorSnackbar from "../../../../requestProvider/errorSnackbar";
import BoxImage from "../../../images/homepage/box.svg";
import rewardState from "../../../store/rewardState";
import useStore from "../../../store/zustand";
import { LocationInfo } from "../type";
import ReachLocationModal from "./reach-location-modal";
import styles from "./reach-location.module.css";
interface Props {
  locationInfo: LocationInfo;
}
export interface gameCount {
  placeCount: number;
  total: number;
  gameReward: number;
}
export default function ReachLocation({ locationInfo }: Props) {
  const [modalOfReach, setModalOfReach] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const [count, setCount] = useState<gameCount>();
  const { getAccessToken } = useStore();
  const [close, setClose] = useState<boolean>(true);
  const { updateRewards } = rewardState();
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { getData } = useNecessary();
  const once = useRef<boolean>(false);
  const api = useApi();

  const getRewardPlaces = async () => {
    const res = await api<placeReward[]>({
      url: `game/online/regwards`,
      method: "GET",
    });
    if (res) updateRewards(res);
    console.log(res);
  };

  const handleClick = () => {
    console.log("qqq");
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "onlineGame" }));
    }
    if (count?.gameReward === -1) {
      setError(t("snackbarError"));
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      setMessage(t("snackbarSuccess"));
      setTimeout(() => {
        setMessage("");
      }, 2000);
      getData();
    }
  };

  const initializeSocket = () => {
    const token = getAccessToken();
    if (!token) {
      console.error("No token found");
      return;
    }
    const ws = new WebSocket(
      `${process.env.REACT_APP_SOCKET_URL}/online_ws?token=${token}`
    );
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "getStatus" }));
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.placeCount !== undefined) {
          setCount({
            placeCount: data.placeCount,
            total: data.total,
            gameReward: data.game_reward,
          });
        }

        if (data.state !== undefined) {
          if (data.state === "idle") {
            setClose(true);
          } else {
            ws.send(JSON.stringify({ type: "getInitialData" }));
            setClose(false);
            getRewardPlaces();
          }
        }

        if (data.claimed !== undefined) {
          if (data.claimed === true) {
            ws.send(JSON.stringify({ type: "getInitialData" }));
          }
        }
      } catch {
        console.log("Error parsing WebSocket message");
      }
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
    socketRef.current = ws;
  };

  useEffect(() => {
    if (!once.current) {
      initializeSocket();
      once.current = true;
    }
  }, []);
  const OpenTheModal = () => {
    if (locationInfo?.claimed_count > 0) {
      setModalOfReach(true);
    }
  };
  return (
    <>
      <div className="w-full flex items-center justify-between p-2 bg-opacity-65 bg-black">
        <button
          className="bg-myColors2-50 w-[54px] h-[60px] flex items-center justify-center rounded-[20px]"
          onClick={OpenTheModal}
        >
          <img src={BoxImage} className="w-[45px] h-[45px]" alt="" />
        </button>
        <div>
          <p className="text-myColors-250 text-lg font-bold pt-1">
            {t("physicalDescr")}
          </p>
        </div>
        <div className="bg-myColors2-50 w-[54px] p-2 px-3 flex items-center justify-center rounded-[20px] flex-col">
          <div className={styles.flicker} />
          <p className="text-myColors-250 font-bold">
            {locationInfo?.claimed_count}/{locationInfo?.claimed_need_to_reward}
          </p>
        </div>
      </div>
      {modalOfReach && (
        <ReachLocationModal
          setModalOfReach={setModalOfReach}
          handleClick={handleClick}
          count={count}
          close={close}
        />
      )}
      <SuccessSnackbar message={message} />
      <ErrorSnackbar error={error} onClose={() => setError("")} />
    </>
  );
}
