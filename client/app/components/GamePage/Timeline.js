import Image from "next/image";
import { motion } from "framer-motion";

const TimeLine = ({ completed, title }) => {
  return (
    <div className="flex flex-row gap-[21px] items-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          background: "rgba(255, 255, 255, 0.40)",
        }}
        className="rounded-xl relative   h-[54px] w-[177px] px-[10px] py-[5px]"
      >
        <p className="font-light">{title}</p>
        {completed && (
          <Image
            src="/icons/checkmark.svg"
            width={1000}
            height={1000}
            className="w-[24px] h-[24px] absolute -bottom-2 -right-2"
          />
        )}
      </motion.div>
      {completed ? (
        <Image
          src="/misc/timeline_blue.svg"
          width={19}
          height={19}
          className="w-[19px]"
        />
      ) : (
        <Image
          src="/misc/timeline_white.svg"
          width={19}
          height={19}
          className="w-[19px]"
        />
      )}

      <img
        src="https://s3-alpha-sig.figma.com/img/8178/cc67/e53777f19290a942835f086e57d8a238?Expires=1724025600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dY6zIZxPghH1h0fMrB-tbuJDJPvWZJjZBg6u5lhMziKD85cLaVYc2M-CD2LByrjVidgpb8p3ePw4FomhcT1sReEuUsE9mUX1d58JhXIJav705JF8htIUhMB5ojnHIcxTpATTAvcDpzC4y4G9RgdgaswPYpmfrIlOWlhScKLzMbqoxps9Xj-bXSO-vNOQPJIMWuKKx~S4OQ8YwdYf9bcMd9Is75e5mATCLMd~9pf10MuwiABInJcP6wCIvj3CkhF47v3z0GSH5xQpaj0IzWeLIng0sqtCzMZhMQpbk9HSBuhLTz6qREy4sNza1D5MSTQrN8PGY6LbhOH6QGSHGvN~6Q__"
        className="w-[50px] h-[50px] object-cover rounded-full -ml-1"
      />
    </div>
  );
};

export default TimeLine;
