import { motion } from "framer-motion";

import PageContainer, {
  SectionHeader,
} from "../../../components/layout/PageContainer";

import BlogManagementTable from "../../../components/admin/blog/BlogManagementTable";

export default function ViewBlogsPage() {
  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <PageContainer>
      <SectionHeader title="View Blogs" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <BlogManagementTable />
      </motion.div>
    </PageContainer>
  );
}