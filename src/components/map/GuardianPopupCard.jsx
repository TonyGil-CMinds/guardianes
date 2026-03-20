import React from "react";
import { X, MapPin } from "lucide-react";

export default function GuardianPopupCard({ guardian, onClose }) {
  if (!guardian) return null;
  return (
    <div className="absolute left-8 bottom-24 z-50 bg-white rounded-2xl shadow-2xl w-72 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {guardian.country && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            <MapPin className="w-3 h-3" />
            {guardian.country}
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-2 pr-8">{guardian.name}</h2>

        {(guardian.role || guardian.organization) && (
          <p className="text-sm text-gray-500 mb-3">
            {guardian.role}
            {guardian.role && guardian.organization && " · "}
            {guardian.organization}
          </p>
        )}

        {guardian.badge_text && (
          <span className="inline-block text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full mb-3">
            {guardian.badge_text}
          </span>
        )}

        {guardian.linkedin_url && (
          <a
            href={guardian.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-black text-white text-sm font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors mt-2"
          >
            Ver Perfil de LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}