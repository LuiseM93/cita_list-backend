// src/app/calculadora-citas-perdidas/CalculadoraClient.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function CalculadoraClient() {
  const [ticket, setTicket] = useState<number | "">("");
  const [citas, setCitas] = useState<number | "">("");
  const [noShow, setNoShow] = useState<number>(20);

  const { semanal, mensual, anual } = useMemo(() => {
    const ticketVal = Number(ticket) || 0;
    const citasVal = Number(citas) || 0;
    const noShowVal = Number(noShow) || 0;

    const perdidasSemanales = ticketVal * citasVal * (noShowVal / 100);
    return {
      semanal: perdidasSemanales,
      mensual: perdidasSemanales * 4.33,
      anual: perdidasSemanales * 52
    };
  }, [ticket, citas, noShow]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-label-lg font-label-lg font-semibold text-on-surface" htmlFor="ticket">
            Ticket promedio por cita (MXN)
          </label>
          <input
            id="ticket"
            type="number"
            min="0"
            value={ticket}
            onChange={(e) => setTicket(e.target.value ? Number(e.target.value) : "")}
            placeholder="Ej. 250"
            className="w-full bg-surface h-[48px] rounded-lg px-4 border border-outline-variant text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-label-lg font-label-lg font-semibold text-on-surface" htmlFor="citas">
            Citas totales por semana
          </label>
          <input
            id="citas"
            type="number"
            min="0"
            value={citas}
            onChange={(e) => setCitas(e.target.value ? Number(e.target.value) : "")}
            placeholder="Ej. 40"
            className="w-full bg-surface h-[48px] rounded-lg px-4 border border-outline-variant text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-label-lg font-label-lg font-semibold text-on-surface" htmlFor="noShow">
            % de clientes que no llegan (no-shows)
          </label>
          <input
            id="noShow"
            type="number"
            min="0"
            max="100"
            value={noShow}
            onChange={(e) => setNoShow(Number(e.target.value))}
            className="w-full bg-surface h-[48px] rounded-lg px-4 border border-outline-variant text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <span className="text-label-sm text-on-surface-variant mt-1">Promedio de la industria: 15-25%</span>
        </div>
      </div>

      <div className="bg-error-container/20 border border-error-container p-5 rounded-2xl flex flex-col gap-3">
        <h3 className="text-title-md font-title-md font-semibold text-on-surface">Dinero perdido estimado</h3>
        
        <div className="flex justify-between items-center py-2 border-b border-error-container/30">
          <span className="text-body-md text-on-surface-variant">Semanal:</span>
          <span className="text-title-md font-semibold text-error">
            ${semanal.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-error-container/30">
          <span className="text-body-md text-on-surface-variant">Mensual:</span>
          <span className="text-title-md font-semibold text-error">
            ${mensual.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-body-md text-on-surface-variant">Anual:</span>
          <span className="text-title-lg font-bold text-error">
            ${anual.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="bg-primary-container p-6 rounded-2xl flex flex-col items-center gap-4 text-center mt-2">
        <h3 className="text-title-lg font-bold text-on-primary-container">
          Evita esto con recordatorios automáticos
        </h3>
        <p className="text-body-md text-on-primary-container/80">
          Un mensaje de WhatsApp a tiempo reduce drásticamente las faltas.
        </p>
        <Link 
          href="/" 
          className="bg-primary text-on-primary h-[48px] px-8 rounded-full font-button-text flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm w-full mt-2"
        >
          Prueba Citalist gratis
        </Link>
      </div>
    </div>
  );
}
