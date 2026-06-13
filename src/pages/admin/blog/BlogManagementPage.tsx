import { motion } from "framer-motion";
import PageContainer, { SectionHeader } from "../../../components/layout/PageContainer";

import BlogManagementTable from "../../../components/admin/blog/BlogManagementTable";
import BlogDrafts from "../../../components/admin/blog/BlogDrafts";
import CreateBlogForm from "../../../components/admin/blog/CreateBlogForm";

import { useState } from "react";

export default function BlogManagementPage() {
  const [showCreate, setShowCreate] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title="Blog Management"
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="
              px-4 py-2 rounded-xl
              bg-white text-black text-sm font-semibold
              hover:bg-neutral-200 transition
            "
          >
            + New Post
          </button>
        }
      />

      {/* Drafts */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <BlogDrafts />
      </motion.div>

      {/* Blog Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
      >
        <BlogManagementTable />
      </motion.div>

      {/* Create Modal */}
      {showCreate && (
        <CreateBlogForm onClose={() => setShowCreate(false)} />
      )}
    </PageContainer>
  );
}
