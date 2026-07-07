import { toast } from "react-toastify";
import { setupService } from "../../services";

export default function TestSetup() {

  const handleInitialize = async () => {
    try {

      console.log("Initialize dimulai...");

      await setupService.initialize();

      console.log("Initialize selesai.");

      toast.success("Database berhasil diinisialisasi.");

    } catch (error) {

      console.error(error);

      toast.error(error.message);

    }
  };

  return (
    <div className="container py-5">

      <h2>Setup Wizard Test</h2>

      <button
        className="btn btn-primary"
        onClick={handleInitialize}
      >
        Initialize Database
      </button>

    </div>
  );
}