import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeamById, getTeamMembers, getTeamMessages, addTeamMember, removeTeamMember, postTeamMessage } from "../../api/teamApi";
import { getAllUsers } from "../../api/userApi";
import { createTaskApi, getTeamTasksApi, updateTaskStatusApi, deleteTaskApi } from "../../api/taskApi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import CustomDropdown from "../../components/ui/CustomDropdown";
import { 
  Users, MessageSquare, Send, Plus, Trash2, ArrowLeft, Shield, 
  CheckCircle2, Clock, ListTodo, MoreHorizontal, User as UserIcon
} from "lucide-react";

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { addToast } = useToast();
  
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chat"); // chat or tasks
  
  // States for adding member
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("MEMBER");
  
  // States for chat
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // States for task creation
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assignedTo: "" });

  const fetchTeamData = useCallback(async () => {
    try {
      const t = await getTeamById(id);
      setTeam(t);
      const mems = await getTeamMembers(id);
      setMembers(mems);
      const msgs = await getTeamMessages(id);
      setMessages(msgs);
      const tks = await getTeamTasksApi(id);
      setTasks(tks);
      
      if (role === "ADMIN" || role === "PM" || role === "PROJECT_MANAGER" || role === "HR") {
        setUsersLoading(true);
        setUsersError(false);
        try {
          const users = await getAllUsers(1, 100);
          setAllUsers(users);
        } catch (err) {
          setUsersError(true);
          addToast("Failed to load employees", "error");
        } finally {
          setUsersLoading(false);
        }
      }
    } catch (err) {
      console.error("Failed to load team details", err);
      addToast("Failed to load team data", "error");
    } finally {
      setLoading(false);
    }
  }, [id, role, addToast]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await postTeamMessage(id, newMessage);
      setNewMessage("");
      const msgs = await getTeamMessages(id);
      setMessages(msgs);
    } catch (err) {
      addToast("Failed to send message", "error");
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    try {
      await addTeamMember(id, { userId: Number(selectedUser), role: selectedRole });
      setSelectedUser("");
      addToast("Member added to team!", "success");
      const mems = await getTeamMembers(id);
      setMembers(mems);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      addToast(msg, "error");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm("Remove this member from the team?")) {
      try {
        await removeTeamMember(id, userId);
        addToast("Member removed", "info");
        const mems = await getTeamMembers(id);
        setMembers(mems);
      } catch (err) {
        addToast("Failed to remove member", "error");
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTaskApi({
        ...taskForm,
        teamId: Number(id),
        assignedTo: Number(taskForm.assignedTo)
      });
      addToast("Task created successfully!", "success");
      setShowTaskModal(false);
      setTaskForm({ title: "", description: "", assignedTo: "" });
      const tks = await getTeamTasksApi(id);
      setTasks(tks);
    } catch (err) {
      addToast("Failed to create task", "error");
    }
  };

  const handleUpdateTaskStatus = async (taskId, current) => {
    const newStatus = current === "PENDING" ? "COMPLETED" : "PENDING";
    let completedWork = "";
    let pendingWork = "";
    
    if (newStatus === "COMPLETED") {
       completedWork = prompt("What's completed?");
       if (completedWork === null) return;
    } else {
       pendingWork = prompt("What remains?");
       if (pendingWork === null) return;
    }

    try {
      await updateTaskStatusApi(taskId, newStatus, completedWork, pendingWork);
      addToast("Task status updated", "success");
      const tks = await getTeamTasksApi(id);
      setTasks(tks);
    } catch (err) {
      addToast("Update failed", "error");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Delete this task?")) {
      try {
        await deleteTaskApi(taskId);
        addToast("Task deleted", "info");
        const tks = await getTeamTasksApi(id);
        setTasks(tks);
      } catch (err) {
         addToast("Failed to delete task", "error");
      }
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!team) return <div className="p-8 text-center text-red-500">Team not found</div>;

  const nonMembers = allUsers.filter(u => 
    u.role?.toUpperCase() === "EMPLOYEE" && !members.find(m => m.userId === u.userId)
  );
  const isPMorAdmin = role === "ADMIN" || role === "PM" || role === "PROJECT_MANAGER";

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/teams")} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">{team.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Project: {team.projectName}
            </p>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
          <button 
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === "chat" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <MessageSquare size={18} /> Chat
          </button>
          <button 
            onClick={() => setActiveTab("tasks")}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === "tasks" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <ListTodo size={18} /> Tasks
            {tasks.filter(t => t.status === 'PENDING').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 animate-pulse">
                {tasks.filter(t => t.status === 'PENDING').length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* Main Area: Chat or Tasks */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {activeTab === "chat" ? (
            <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar flex flex-col-reverse bg-slate-50/20 dark:bg-slate-900/10">
                <div ref={messagesEndRef} />
                {messages.map((msg) => {
                  const isMine = msg.userId === user?.userId;
                  return (
                    <div key={msg.messageId} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                      <div className={`p-4 max-w-[85%] rounded-2xl ${
                        isMine 
                        ? "bg-blue-600 text-white rounded-br-sm shadow-xl shadow-blue-500/20" 
                        : "bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-sm shadow-sm"
                      }`}>
                        {!isMine && (
                          <div className="text-xs font-bold mb-1 opacity-70 flex items-center gap-1.5 text-blue-500 dark:text-blue-400">
                            {msg.userName} • {msg.userRole}
                          </div>
                        )}
                        <div className="text-sm lg:text-base whitespace-pre-wrap leading-relaxed">{msg.message}</div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md">
                <div className="flex gap-2 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message to your team..."
                    className="flex-1 px-5 py-3 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/30 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-600/20 disabled:opacity-40 transition-all flex items-center justify-center shrink-0 active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 glass-panel rounded-2xl flex flex-col border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-800/40">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-widest text-xs">
                    Team Mission Checklist
                  </h3>
                  {isPMorAdmin && (
                    <button 
                      onClick={() => setShowTaskModal(true)}
                      className="px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 rounded-xl flex items-center gap-1.5 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
                    >
                      <Plus size={14} /> Create Task
                    </button>
                  )}
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                  {tasks.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 italic space-y-4">
                      <ListTodo size={64} className="opacity-20" />
                      <p className="text-sm font-medium">No tasks established for this team pipeline.</p>
                    </div>
                  )}
                  {tasks.map(task => (
                    <div key={task.taskId} className={`p-5 rounded-2xl border transition-all ${task.status === 'COMPLETED' ? 'bg-green-50/30 dark:bg-green-900/5 border-green-100 dark:border-green-900/20 opacity-80' : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'}`}>
                       <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-lg leading-snug ${task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-800 dark:text-white'}`}>{task.title}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 whitespace-pre-wrap">{task.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${task.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                               {task.status}
                            </span>
                            {isPMorAdmin && (
                               <button onClick={() => handleDeleteTask(task.taskId)} className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                 <Trash2 size={14} />
                               </button>
                            )}
                          </div>
                       </div>
                       
                       <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                             <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                               <UserIcon size={12} />
                             </div>
                             <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-tight">{task.assignedToName}</span>
                          </div>
                          
                          <div className="flex gap-2">
                             {(task.assignedTo === user?.userId || isPMorAdmin) && (
                                <button 
                                  onClick={() => handleUpdateTaskStatus(task.taskId, task.status)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${task.status === 'PENDING' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 active:scale-95' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600' }`}
                                >
                                  {task.status === 'PENDING' ? <><CheckCircle2 size={14} /> Done</> : <><Clock size={14} /> Revive</>}
                                </button>
                             )}
                          </div>
                       </div>

                       {(task.completedWork || task.pendingWork) && (
                         <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {task.completedWork && (
                              <div className="p-3 bg-green-500/5 rounded-xl border border-green-500/10">
                                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase block mb-1">Delivered</span>
                                <div className="text-sm text-slate-700 dark:text-slate-300 italic">"{task.completedWork}"</div>
                              </div>
                            )}
                            {task.pendingWork && (
                              <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block mb-1">Obstacles</span>
                                <div className="text-sm text-slate-700 dark:text-slate-300 italic">"{task.pendingWork}"</div>
                              </div>
                            )}
                         </div>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Sidebar: Members */}
        <div className="w-full lg:w-96 flex flex-col gap-6 h-full min-h-0 overflow-y-auto custom-scrollbar lg:overflow-visible shrink-0">
          <div className="glass-panel rounded-2xl flex flex-col min-h-[300px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm shrink-0">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="text-indigo-500" size={20} />
                <h2 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-[10px]">Team Roster ({members.length})</h2>
              </div>
            </div>

            <div className="p-2 space-y-1">
              {members.map(member => (
                <div key={member.id} className="p-3 flex items-center justify-between hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/10 transform group-hover:rotate-6 transition-transform">
                      {member.userName?.[0] || "?"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{member.userName} {member.userId === user?.userId && "(You)"}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1 mt-0.5 uppercase tracking-tighter">
                        <Shield size={10} className="text-blue-500" />
                        {member.role}
                      </div>
                    </div>
                  </div>
                  {(role === "ADMIN" || role === "PM" || role === "PROJECT_MANAGER" || role === "HR") && member.userId !== user?.userId && (
                    <button 
                      onClick={() => handleRemoveMember(member.userId)}
                      className="p-2 text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-lg opacity-0 lg:group-hover:opacity-100 transition-all active:scale-90"
                      title="Excommunicate member"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Member Widget */}
          {(role === "ADMIN" || role === "PM" || role === "PROJECT_MANAGER" || role === "HR") && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shrink-0">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                <Plus size={14} className="text-blue-500" /> Expand Workspace
              </h3>
              <div className="space-y-4">
                <CustomDropdown
                  placeholder="Select Employee"
                  options={nonMembers.map(u => ({ label: `${u.fullName} (${u.role})`, value: u.userId.toString() }))}
                  value={selectedUser}
                  onChange={setSelectedUser}
                  emptyMessage={usersError ? "Failed to load employees" : usersLoading ? "Searching..." : "No employees available"}
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                     <CustomDropdown
                        options={[
                          { label: "MEMBER", value: "MEMBER" },
                          { label: "LEADER", value: "LEADER" },
                          { label: "CONSULTANT", value: "CONSULTANT" }
                        ]}
                        value={selectedRole}
                        onChange={setSelectedRole}
                      />
                  </div>
                  <button
                    onClick={handleAddMember}
                    disabled={!selectedUser}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-40 transition-all flex items-center justify-center active:scale-95 shrink-0"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTaskModal(false)}></div>
           <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Create New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-5">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Task Title</label>
                   <input 
                     required
                     value={taskForm.title}
                     onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-800 dark:text-white placeholder-slate-400"
                     placeholder="Deployment strategy..."
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                   <textarea 
                     rows="3"
                     value={taskForm.description}
                     onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                     className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 custom-scrollbar resize-none"
                     placeholder="Outline the steps to push to production..."
                   ></textarea>
                 </div>
                 
                 <CustomDropdown 
                   label="Assign Talent"
                   placeholder="Assign to..."
                   options={members.map(m => ({ label: m.userName, value: m.userId.toString() }))}
                   value={taskForm.assignedTo}
                   onChange={(val) => setTaskForm({...taskForm, assignedTo: val})}
                 />

                 <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Deploy Task</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
