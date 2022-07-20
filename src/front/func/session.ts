import { PlayerSession } from "../../types";

export function saveSession(session: PlayerSession): PlayerSession {
    localStorage.setItem('id', session.id);
    localStorage.setItem('name', session.name);
    localStorage.setItem('signature', session.signature);
    return session;
}

export function getSession(): PlayerSession | null {
    const id = localStorage.getItem('id');
    const name = localStorage.getItem('name');
    const signature = localStorage.getItem('signature');
    if (!id || !signature || !name) { return null; }
    return { id, name, signature };
}

export function logout(): void {
    localStorage.clear();
}