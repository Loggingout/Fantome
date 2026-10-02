import PageContainer, { SectionHeader } from "../../components/layout/PageContainer";
import BlogManagementTable from "../../components/admin/blog/BlogManagementTable";

export default function BlogDraftsPage() {
    return (
        <PageContainer>
            <SectionHeader title="Drafted Blogs" />
            <BlogManagementTable showOnlyDrafts />
        </PageContainer>
    );
}