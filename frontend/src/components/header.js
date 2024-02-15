
import { tokenService } from "@/service/auth/tokenService";
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useState } from "react";
import Modal from "./dialogAppointment";



export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleLogout = async () => {
        const willLogout = await Swal.fire({
            title: 'Você tem certeza?',
            text: "Você está prestes a sair da sua conta!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, sair!'
        });

        if (willLogout.isConfirmed) {
            try {
                setIsLoggingOut(true);

                tokenService.delete();
                router.push('/login');
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo deu errado!',
                });
                setIsLoggingOut(false);
            }
        }
    };
    if (isLoggingOut) {
        return (
            <div style={{ zIndex: 1000 }} className="flex items-center justify-center">
                {/* Spinner Component */}
                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
                </svg>
            </div>
        );
    }

    return (
        <header className="flex px-4 py-2 justify-center ">
            <div className="m-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
                    onClick={openModal}
                >
                    Novo agendamento
                </button>
            </div>
            <div className="m-4">
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 focus:outline-none"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} />
        </header>
    )
}
