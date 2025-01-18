import React from 'react';
import { Member } from './ChatRoomClient';
import Avatar from './Avatar';

const Navbar = ({ members }: { members: Member[] }) => {
    return (
        <div className="fixed top-0 left-0 right-0 z-20 py-3">
            <div className="flex justify-center">
                <ul className="flex space-x-12">
                    {members.map((member, i) => (
                        <li key={i}>
                            <Avatar name={member.username} color={member.color} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;